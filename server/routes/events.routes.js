const express = require("express");
const router = express.Router();
const { getEvents, createEvent } = require("../controllers/events.controller");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

router.get("/", verifyToken, getEvents); // Students & Admins can view
router.post("/", verifyToken, verifyAdmin, createEvent); // ONLY Admins can post

module.exports = router;