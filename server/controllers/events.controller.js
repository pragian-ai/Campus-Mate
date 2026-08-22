const db = require("../config/database");

const getEvents = (req, res) => {
    db.all("SELECT * FROM events ORDER BY date ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

const createEvent = (req, res) => {
    const { title, date, time, location, description } = req.body;
    const sql = "INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)";
    
    db.run(sql, [title, date, time, location, description], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error saving event." });
        res.status(201).json({ success: true, message: "Event published!" });
    });
};

module.exports = { getEvents, createEvent };