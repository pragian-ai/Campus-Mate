const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // New import for sessions

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        
        db.run(sql, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ success: false, message: "Email already exists." });
                }
                return res.status(500).json({ success: false, message: "Database error." });
            }
            
            res.status(201).json({ 
                success: true, 
                message: "Account created successfully!",
                userId: this.lastID 
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Check if fields are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    try {
        // 2. Find the user in the database
        const sql = `SELECT * FROM users WHERE email = ?`;
        db.get(sql, [email], async (err, user) => {
            if (err) return res.status(500).json({ success: false, message: "Database error." });
            
            // If no user is found
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password." });
            }

            // 3. Compare the typed password with the hashed database password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password." });
            }

            // 4. Generate a JWT Token (This is their digital ID card)
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET || "campusx_secret_key_123", // Fallback if no .env
                { expiresIn: "1d" } // Token expires in 1 day
            );

            // 5. Send success response with token
            res.json({
                success: true,
                message: "Logged in successfully!",
                token: token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Export both functions
module.exports = { signup, login };