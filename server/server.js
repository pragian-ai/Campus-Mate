const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;


const verifyToken = require("./middleware/auth");



// =================================
// MIDDLEWARE (Must be first!)
// =================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// =================================
// ROUTES 
// =================================
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const lostFoundRoutes = require("./routes/lostFound.routes");
app.use("/api/lost-found", lostFoundRoutes);

const eventsRoutes = require("./routes/events.routes");
app.use("/api/events", eventsRoutes);

const queuesRoutes = require("./routes/queues.routes");
app.use("/api/queues", queuesRoutes);

// =================================
// FRONTEND
// =================================

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);



// =================================
// TEST API
// =================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CampusX backend is working!"
    });
});

app.get("/api/dashboard-data", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the secret dashboard!",
        user: req.user // This shows who made the request based on the token
    });
});

// =================================
// START SERVER
// =================================

app.listen(PORT, () => {
    console.log("");
    console.log("================================");
    console.log("       CAMPUSX SERVER");
    console.log("================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API:    http://localhost:${PORT}/api/test`);
    console.log("Database: Connected");
    console.log("================================");
    console.log("");
});