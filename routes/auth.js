const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID
};
const userPool = new CognitoUserPool(poolData);

// **User Registration**
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const user = await User.create({ username, email, role });

        userPool.signUp(email, password, [], null, (err, data) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "User registered successfully!", user: data });
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **User Login**
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
        onSuccess: (result) => {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: "Login successful", token });
        },
        onFailure: (err) => res.status(400).json({ error: err.message })
    });
});

module.exports = router;
