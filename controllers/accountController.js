// controllers/accountController.js
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator");
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 * Deliver Account Management View
 * ************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  const token = req.cookies.jwt;

  let accountData;
  try {
    accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData, // 👈 Pass decoded JWT to the view
    message: req.flash("message"),
    errors: null,
  });
}

async function buildUpdateView(req, res) {
  const accountId = req.params.accountId;

  try {
    const accountData = await accountModel.getAccountById(accountId);
    res.render("account/update-account", {
      title: "Update Account Information",
      accountData,
      errors: null,
      message: null
    });
  } catch (error) {
    console.error("Error loading update view:", error);
    res.status(500).render("account/account-management", {
      title: "Account Management",
      message: "Sorry, there was a problem loading your account.",
      accountData: null
    });
  }
}

// Process account info update
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

  if (updateResult) {
    req.flash("notice", "Account updated successfully.");
  } else {
    req.flash("notice", "Account update failed.");
  }

  const accountData = await accountModel.getAccountById(account_id);
  res.render("./account/management", {
    title: "Account Management",
    accountData,
    message: req.flash("notice"),
  });
}


// Show account update view
async function buildUpdateAccountView(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("message", "Account not found.")
    return res.redirect("/account")
  }

  const nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
    message: req.flash("message")
  })
}

// Process password change
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
    } else {
      req.flash("notice", "Password update failed.");
    }

    const accountData = await accountModel.getAccountById(account_id);
    res.render("./account/management", {
      title: "Account Management",
      accountData,
      message: req.flash("notice"),
    });
  } catch (error) {
    req.flash("notice", "Error updating password.");
    const accountData = await accountModel.getAccountById(account_id);
    res.render("./account/update", {
      title: "Update Account",
      accountData,
      message: req.flash("notice"),
    });
  }
}

function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
}






module.exports = {
  buildAccountManagement,
  buildLogin,
  buildRegister,
  registerAccount,
  buildUpdateView,
  updateAccount,
  buildUpdateAccountView,
  updatePassword,
  logout,
}
