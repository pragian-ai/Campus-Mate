const db = require("../config/database");

// 1. Secure Claims Table Setup
db.run(`CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    user_id INTEGER NOT NULL,
    gr_number TEXT NOT NULL,
    mobile TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 2. GET ALL ITEMS
const getItems = (req, res) => {
    db.all("SELECT * FROM lost_found ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

// 3. CREATE NEW ITEM
const createItem = (req, res) => {
    const { name, status, location, contact, description } = req.body;
    const sql = "INSERT INTO lost_found (name, status, location, contact, description) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [name, status, location, contact, description || ""], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.status(201).json({ success: true, message: "Item reported successfully!" });
    });
};

// 4. SECURE CLAIM & STATUS LOCK
const claimItem = (req, res) => {
    const { item_id, gr_number, mobile } = req.body;
    const userId = req.userId;

    if (!item_id || !gr_number || !mobile) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sqlClaim = "INSERT INTO claims (item_id, user_id, gr_number, mobile) VALUES (?, ?, ?, ?)";
    db.run(sqlClaim, [item_id, userId, gr_number, mobile], (err) => {
        if (err) {
            console.error("Claim insert error:", err);
            return res.status(500).json({ success: false, message: "Error submitting claim." });
        }

        const sqlUpdateItem = "UPDATE lost_found SET status = 'Claimed' WHERE id = ?";
        db.run(sqlUpdateItem, [item_id], (err2) => {
            if (err2) console.error("Item status update error:", err2);
            res.status(201).json({ success: true, message: "Claim logged and item marked as Claimed!" });
        });
    });
};

// 5. ADMIN VIEW CLAIMS (JOINED WITH USERS TABLE)
const getClaims = (req, res) => {
    const sql = `
        SELECT c.*, l.name as item_name, l.status as item_status, u.name as real_name, u.email as real_email 
        FROM claims c 
        JOIN lost_found l ON c.item_id = l.id 
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { getItems, createItem, claimItem, getClaims };