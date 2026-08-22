const db = require("../config/database");

const submitComplaint = (req, res) => {
    const { title, description, category } = req.body;
    const userId = req.user.id; 

    if (!title || !description || !category) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `INSERT INTO complaints (title, description, category, user_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [title, description, category, userId], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.status(201).json({ success: true, message: "Complaint submitted!", complaintId: this.lastID });
    });
};

const getMyComplaints = (req, res) => {
    const userId = req.user.id;
    db.all("SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { submitComplaint, getMyComplaints };