require("dotenv").config();
const express = require("express");
const { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } = require("amazon-cognito-identity-js");
const axios = require("axios");

const router = express.Router();

// Cognito Configuration
const poolData = {
    UserPoolId: process.env.COGNITO_POOL_ID, // Cognito User Pool ID
    ClientId: process.env.COGNITO_BACKEND_CLIENT_ID, // Cognito App Client ID (Backend)
};

const userPool = new CognitoUserPool(poolData);

/**
 * @route POST /auth/signup
 * @desc Register a new user
 */
router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    const attributeList = [
        new CognitoUserAttribute({ Name: "name", Value: name }),
        new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Signup successful! Please check your email to verify your account.", userId: result.userSub });
    });
});

/**
 * @route POST /auth/login
 * @desc Authenticate user and return JWT token
 */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
        onSuccess: (session) => {
            res.json({
                message: "Login successful!",
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIdToken().getJwtToken(),
            });
        },
        onFailure: (err) => res.status(400).json({ error: err.message }),
    });
});

/**
 * @route GET /auth/verify-token
 * @desc Verify JWT token
 */
router.get("/verify-token", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Validate token using AWS Cognito
        const response = await axios.get(`https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`);

        if (response.status === 200) {
            res.json({ message: "Token is valid" });
        } else {
            res.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        res.status(500).json({ error: "Token verification failed" });
    }
});

module.exports = router;
