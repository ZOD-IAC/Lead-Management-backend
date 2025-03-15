// backend/app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { isLoggedIn } = require("./middleware/isLoggedIn");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./config/mongoose-connect");

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

// Import routes
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require("./routes/leadRoutes");

app.use("/api/users", userRoutes);
app.use("/api/leads", isLoggedIn, leadRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
