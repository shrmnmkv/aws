require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(() => console.log("PostgreSQL Connected..."))
    .catch(err => console.error("Database Connection Error:", err));

// Import Auth Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Root Endpoint
app.get("/", (req, res) => {
    res.send("Freelance Marketplace Backend Running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
