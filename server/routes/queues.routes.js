const express = require("express");
const router = express.Router();
const { getQueues, updateQueue } = require("../controllers/queues.controller");
const verifyToken = require("../middleware/auth");

// GET /api/queues - View all queues
router.get("/", verifyToken, getQueues);

// PUT /api/queues - Update a queue (Admin feature)
router.put("/", verifyToken, updateQueue);

module.exports = router;