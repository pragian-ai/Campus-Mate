const express = require("express");
const router = express.Router();
const { getAllEvents, createEvent } = require("../controllers/events.controller");
const verifyToken = require("../middleware/auth");

// GET /api/events - View all events
router.get("/", verifyToken, getAllEvents);

// POST /api/events - Create a new event
router.post("/", verifyToken, createEvent);

module.exports = router;