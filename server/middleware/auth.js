const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ success: false, message: "No token provided." });
    }

    // This strips the "Bearer " part that our frontend sends
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    // This must match the exact secret used in auth.controller.js
    jwt.verify(token, process.env.JWT_SECRET || "super_secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

module.exports = verifyToken;