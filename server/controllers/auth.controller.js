const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// 1. REGISTER FUNCTION
const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, email, hashedPassword], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: "Email already registered or database error." });
        }
        res.status(201).json({ success: true, message: "Registration successful!" });
    });
};

// 2. LOGIN FUNCTION (With the new Admin Role fix!)
const login = (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ success: false, message: "Invalid credentials." });

        // Include the role in the token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || "super_secret_key", 
            { expiresIn: 86400 } // 24 hours
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token: token,
            role: user.role // Send role to frontend
        });
    });
};

// 3. EXPORT BOTH
module.exports = { register, login };