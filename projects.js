const express = require("express");
const pool = require("./database");
const router = express.Router();

// Get All Projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create New Project
router.post("/", async (req, res) => {
  const { employer_id, title, description, budget } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO projects (employer_id, title, description, budget, status) VALUES ($1, $2, $3, $4, 'open') RETURNING *",
      [employer_id, title, description, budget]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
