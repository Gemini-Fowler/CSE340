const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to display login view
router.get("/login", utilities.handleErrors(accountController.loginAccount));

// Route to display registration view
router.get("/register", utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send("login process");
  }
);

module.exports = router;
