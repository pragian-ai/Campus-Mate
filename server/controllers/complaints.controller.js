const db = require("../config/database");

const createComplaint = (req, res) => {
    const { title, category, description } = req.body;
    const sql = "INSERT INTO complaints (title, category, description) VALUES (?, ?, ?)";
    db.run(sql, [title, category, description], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error saving complaint" });
        res.status(201).json({ success: true, message: "Complaint submitted!" });
    });
};

const getComplaints = (req, res) => {
    db.all("SELECT * FROM complaints ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { createComplaint, getComplaints };