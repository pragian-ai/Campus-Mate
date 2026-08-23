const express = require("express");
const cors = require("cors");
const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serves your frontend HTML/CSS/JS

// 2. Route Imports
const authRoutes = require("./routes/auth.routes");
const lostFoundRoutes = require("./routes/lostFound.routes");
const sosRoutes = require("./routes/sos.routes");
const assistantRoutes = require("./routes/assistant.routes");
const complaintsRoutes = require("./routes/complaints.routes");
const eventsRoutes = require("./routes/events.routes");
const queuesRoutes = require("./routes/queues.routes");


// 3. API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/queues", queuesRoutes);


// 4. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 CampusX Server running on port ${PORT}`);
});