const db = require("../config/database");

const getAllEvents = (req, res) => {
    // We order by date so upcoming events show first
    db.all("SELECT * FROM events ORDER BY date ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

const createEvent = (req, res) => {
    const { title, description, date, time, location } = req.body;
    const userId = req.user.id; // From our JWT shield!

    if (!title || !date || !location) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const sql = `INSERT INTO events (title, description, date, time, location, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [title, description, date, time, location, userId], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.status(201).json({ success: true, message: "Event added!", eventId: this.lastID });
    });
};

module.exports = { getAllEvents, createEvent };