const db = require("../config/database");

const triggerSOS = (req, res) => {
    const { latitude, longitude } = req.body;
    const userId = req.userId; // Provided by auth middleware

    if (!latitude || !longitude) {
        return res.status(400).json({ success: false, message: "Location data required." });
    }

    const sql = "INSERT INTO sos_alerts (user_id, latitude, longitude) VALUES (?, ?, ?)";
    
    db.run(sql, [userId, latitude, longitude], function(err) {
        if (err) {
            console.error("SOS Insert Error:", err);
            return res.status(500).json({ success: false, message: "Database error." });
        }
        res.status(201).json({ success: true, message: "SOS Alert Sent!" });
    });
};

const getActiveAlerts = (req, res) => {
    // Join with users table to get the name and email of who sent it
    const sql = `
        SELECT s.*, u.name, u.email 
        FROM sos_alerts s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.status = 'Active' 
        ORDER BY s.created_at DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { triggerSOS, getActiveAlerts };