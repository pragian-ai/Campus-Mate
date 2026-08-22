const express = require("express");
const router = express.Router();
const { triggerSOS, getActiveAlerts } = require("../controllers/sos.controller");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

// Student triggers SOS
router.post("/", verifyToken, triggerSOS);

// Admin gets all active alerts
router.get("/admin/all", verifyToken, verifyAdmin, getActiveAlerts);

module.exports = router;