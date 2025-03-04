const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Default Route
app.get('/', (req, res) => res.send("🚀 API is running"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await sequelize.sync(); // Sync database
});
