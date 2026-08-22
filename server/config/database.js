const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // Import the File System module

// 1. Define the directory and file paths
const dbDir = path.resolve(__dirname, '../../database');
const dbPath = path.join(dbDir, 'campusx.db');

// 2. Create the directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 3. Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error("Error creating users table:", err);
});

db.run(`CREATE TABLE IF NOT EXISTS lost_found (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,         -- 'lost' or 'found'
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active' or 'recovered'
    user_id INTEGER,            -- Links the item to the user who reported it
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)`, (err) => {
    if (err) console.error("Error creating lost_found table:", err);
});
// Create Events Table
db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
)`, (err) => {
    if (err) console.error("Error creating events table:", err);
});

module.exports = db;