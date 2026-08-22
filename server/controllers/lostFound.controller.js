const db = require("../config/database");

// Add a new lost or found item
const createReport = (req, res) => {
    const { type, title, description, category, location } = req.body;
    
    // Thanks to our verifyToken middleware, we know EXACTLY who is making this request!
    const userId = req.user.id; 

    if (!type || !title || !location) {
        return res.status(400).json({ success: false, message: "Type, title, and location are required." });
    }

    const sql = `INSERT INTO lost_found (type, title, description, category, location, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [type, title, description, category, location, userId], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        
        res.status(201).json({ 
            success: true, 
            message: "Report created successfully!", 
            reportId: this.lastID 
        });
    });
};

// Get all items
const getAllReports = (req, res) => {
    const sql = `SELECT * FROM lost_found ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { createReport, getAllReports };