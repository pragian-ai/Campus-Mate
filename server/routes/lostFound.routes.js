const express = require("express");
const router = express.Router();
const { createReport, getAllReports } = require("../controllers/lostFound.controller");
const verifyToken = require("../middleware/auth"); // Import our shield

// Apply the shield to these routes
router.post("/", verifyToken, createReport);
router.get("/", verifyToken, getAllReports);

module.exports = router;