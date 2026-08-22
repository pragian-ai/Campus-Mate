const express = require("express");
const router = express.Router();
const { getQueues } = require("../controllers/queues.controller");
const verifyToken = require("../middleware/auth");

// Anyone logged in can view the queues
router.get("/", verifyToken, getQueues);

module.exports = router;