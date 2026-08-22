const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// Route 1: Register
router.post("/register", register);

// Route 2: Login
router.post("/login", login);

module.exports = router;