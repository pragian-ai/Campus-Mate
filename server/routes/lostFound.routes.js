const express = require("express");
const router = express.Router();
const { getItems, createItem, claimItem, getClaims } = require("../controllers/lostFound.controller");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

// Student & Admin feeds
router.get("/", verifyToken, getItems);
router.post("/", verifyToken, verifyAdmin, createItem);

// NEW: Claim Routes
router.post("/claim", verifyToken, claimItem); // Students submit claims
router.get("/admin/claims", verifyToken, verifyAdmin, getClaims); // Admins view claims

module.exports = router;