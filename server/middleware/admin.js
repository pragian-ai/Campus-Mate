const verifyAdmin = (req, res, next) => {
    // req.userRole is extracted by auth.js before it gets here
    if (req.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Access Denied: Requires Admin Privileges." });
    }
    next();
};

module.exports = verifyAdmin;