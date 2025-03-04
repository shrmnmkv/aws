const express = require("express");
const router = express.Router();
const db = require("./db");

// Create a new project
router.post("/projects", (req, res) => {
  const { employer_id, title, description, budget } = req.body;

  db.query(
    "INSERT INTO projects (employer_id, title, description, budget) VALUES (?, ?, ?, ?)",
    [employer_id, title, description, budget],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Project created successfully" });
    }
  );
});

// Get all projects
router.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Apply for a project
router.post("/applications", (req, res) => {
  const { freelancer_id, project_id, proposal } = req.body;

  db.query(
    "INSERT INTO applications (freelancer_id, project_id, proposal) VALUES (?, ?, ?)",
    [freelancer_id, project_id, proposal],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Application submitted" });
    }
  );
});

module.exports = router;
