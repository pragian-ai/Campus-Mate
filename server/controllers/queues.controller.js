const db = require("../config/database");

const getQueues = (req, res) => {
    db.all("SELECT * FROM queues", [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, data: rows });
    });
};

// We will use this later when we build the Admin panel to update the queues
const updateQueue = (req, res) => {
    const { facility_name, people_waiting, estimated_wait_min, status } = req.body;
    
    const sql = `UPDATE queues SET people_waiting = ?, estimated_wait_min = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE facility_name = ?`;
    
    db.run(sql, [people_waiting, estimated_wait_min, status, facility_name], function(err) {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, message: "Queue updated successfully!" });
    });
};

module.exports = { getQueues, updateQueue };