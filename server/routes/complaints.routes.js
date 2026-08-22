const express = require("express");
const router = express.Router();
const { createComplaint, getComplaints } = require("../controllers/complaints.controller");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

router.post("/", verifyToken, createComplaint);
router.get("/admin/all", verifyToken, verifyAdmin, getComplaints);

module.exports = router;