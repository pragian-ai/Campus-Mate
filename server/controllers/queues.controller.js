const db = require("../config/database");

const getQueues = (req, res) => {
    db.all("SELECT * FROM queues", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

module.exports = { getQueues };