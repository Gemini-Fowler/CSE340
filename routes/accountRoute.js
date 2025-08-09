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
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
// Default account management view ("/account/")
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// GET route to deliver the update view
router.get("/update/:accountId", utilities.checkLogin, accountController.buildUpdateView);

// POST route to handle account info update
router.post("/update",
  accountValidation.updateAccountRules(),
  accountValidation.checkUpdateData,
  utilities.checkData,
  accountController.updateAccount
);

// POST route to handle password change
router.post("/update-password",
  accountValidation.updatePasswordRules(),
  accountValidation.checkPasswordData,
  accountController.updatePassword,
  utilities.checkData
);

router.get("/logout", accountController.logout);

module.exports = router;
