const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkAccountType(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded;
      next();
    } else {
      req.flash("notice", "You do not have permission to access this page.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    req.flash("notice", "Invalid token. Please log in again.");
    return res.redirect("/account/login");
  }
}

module.exports = checkAccountType;
