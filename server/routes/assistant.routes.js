const express = require("express");
const router = express.Router();
const { askAssistant } = require("../controllers/assistant.controller");
const verifyToken = require("../middleware/auth");

// POST /api/assistant
router.post("/", verifyToken, askAssistant);

module.exports = router;