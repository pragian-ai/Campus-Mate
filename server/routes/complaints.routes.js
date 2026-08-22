const express = require("express");
const router = express.Router();
const { submitComplaint, getMyComplaints } = require("../controllers/complaints.controller");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, submitComplaint);
router.get("/", verifyToken, getMyComplaints);

module.exports = router;