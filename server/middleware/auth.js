const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // 1. Look for the token in the authorization header
    // It usually comes in the format: "Bearer eyJhbG..."
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. No token provided." 
        });
    }

    try {
        // 2. Verify the token using our secret key
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "campusx_secret_key_123"
        );
        
        // 3. Attach the decoded user data to the request so we know who is making it
        req.user = decoded; 
        
        // 4. Move on to the actual route logic!
        next(); 
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token." 
        });
    }
};

module.exports = verifyToken;