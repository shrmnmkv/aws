const { Pool } = require("pg");

// PostgreSQL Database Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Required for AWS RDS
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected..."))
  .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = pool;
