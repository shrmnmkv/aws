const express = require("express");
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require("amazon-cognito-identity-js");

const router = express.Router();

const poolData = {
  UserPoolId: process.env.COGNITO_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

// Signup Route
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  userPool.signUp(email, password, [{ Name: "email", Value: email }], null, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Signup successful!", user: result.user });
  });
});

// Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  user.authenticateUser(authDetails, {
    onSuccess: (session) => res.json({ token: session.getIdToken().getJwtToken() }),
    onFailure: (err) => res.status(400).json({ error: err.message }),
  });
});

module.exports = router;
