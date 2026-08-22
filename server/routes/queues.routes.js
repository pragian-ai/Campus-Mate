const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getQueues, updateQueue, createQueue } = require("../controllers/queues.controller");

router.get("/", verifyToken, getQueues);
router.put("/", verifyToken, updateQueue);
router.post("/", verifyToken, createQueue);

module.exports = router;