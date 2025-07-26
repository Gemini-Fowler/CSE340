const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");

// Route to display vehicle details by ID
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;
