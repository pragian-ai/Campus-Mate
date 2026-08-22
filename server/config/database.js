const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Connect to the SQLite database
const dbPath = path.resolve(__dirname, '../../campusx.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// 1. Create Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error("Error creating users table:", err);
    else {
        // Auto-create Admin for testing
        const hash = bcrypt.hashSync("admin123", 10);
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Campus Admin', 'admin@campusx.com', ?, 'admin')`, [hash]);
    }
});

// 2. Create Lost & Found Table
db.run(`CREATE TABLE IF NOT EXISTS lost_found (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error("Error creating lost_found table:", err);
});

db.run(`CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    user_id INTEGER NOT NULL,
    gr_number TEXT NOT NULL,
    mobile TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 3. Create Events Table
db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error("Error creating events table:", err);
});

// 4. Create Queues Table (Smart Wait)
db.run(`CREATE TABLE IF NOT EXISTS queues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facility_name TEXT UNIQUE NOT NULL,
    people_waiting INTEGER DEFAULT 0,
    estimated_wait_min INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Normal',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (!err) {
        // Auto-insert dummy data for the demo!
        db.run(`INSERT OR IGNORE INTO queues (facility_name, people_waiting, estimated_wait_min, status) VALUES ('Main Canteen', 24, 15, 'Busy')`);
        db.run(`INSERT OR IGNORE INTO queues (facility_name, people_waiting, estimated_wait_min, status) VALUES ('Library Print Station', 2, 5, 'Normal')`);
        db.run(`INSERT OR IGNORE INTO queues (facility_name, people_waiting, estimated_wait_min, status) VALUES ('IT Help Desk', 8, 20, 'Busy')`);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 5. Create SOS Alerts Table
db.run(`CREATE TABLE IF NOT EXISTS sos_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)`, (err) => {
    if (err) console.error("Error creating sos_alerts table:", err);
});

module.exports = db;