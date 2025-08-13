const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const invValidate = {};


// Registration validation rules
function registrationRules() {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email")
        }
      }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

async function checkRegData(req, res, next) {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

// Add similar definitions for loginRules, checkLoginData, updateAccountRules, checkUpdateData, updatePasswordRules, checkPasswordData
// For example:
function loginRules() {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

async function checkLoginData(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email: req.body.account_email,
    })
    return
  }
  next()
}

function updateAccountRules() {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail().withMessage("Valid email required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email);
        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already in use.");
        }
      }),
  ];
}

async function checkUpdateData(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      ...req.body,
    })
    return
  }
  next()
}

function updatePasswordRules() {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password must be strong (12+ chars, upper/lowercase, number, symbol)."),
  ];
}

async function checkPasswordData(req, res, next) {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-password", {
      title: "Update Password",
      nav,
      errors,
      ...req.body,
    })
    return
  }
  next()
}

// Export all functions
module.exports = {
  invValidate,
  registrationRules,
  checkRegData,
  loginRules,
  checkLoginData,
  updateAccountRules,
  checkUpdateData,
  updatePasswordRules,
  checkPasswordData
}