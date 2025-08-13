const pool = require("../database");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

/* **************************************
* Build the classification view HTML
* ************************************ */
async function buildClassificationGrid(data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

/**
 * Build vehicle detail HTML markup.
 */
const buildVehicleDetail = (vehicle) => {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-img" />
      <div class="vehicle-info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <h2>Price: $${vehicle.inv_price.toLocaleString()}</h2>
        <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `;
};


/* ****************************************
 * Build dynamic navigation menu
 **************************************** */
const getNav = async () => {
  try {
    const sql = `
      SELECT classification_id, classification_name
      FROM classification
      ORDER BY classification_name
    `;
    const result = await pool.query(sql);

    let nav = '<ul class="main-nav">';
    nav += `<li><a href="/">Home</a></li>`;

    result.rows.forEach((row) => {
      nav += `<li><a href="/inv/type/html/${row.classification_id}">${row.classification_name}</a></li>`;
    });

    nav += `<li><a href="/error/trigger">Trigger Error</a></li>`;
    nav += "</ul>";
    return nav;
  } catch (error) {
    console.error("Error building navigation menu:", error);
    return `
      <ul class="main-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
        <li><a href="/error/trigger">Trigger Error</a></li>
      </ul>
    `;
  }
};

/* ****************************************
 * Middleware to catch async errors
 **************************************** */
function handleErrors(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ****************************************
 * Middleware to check JWT token
 **************************************** */
function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      res.locals.loggedin = true;
      res.locals.accountData = accountData;
      next();
    });
  } else {
    res.locals.loggedin = false;
    next();
  }
}

/* ****************************************
 * Middleware to require login
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
}

/* ****************************************
 * Middleware to restrict by account type
 **************************************** */
function checkAccountType(req, res, next) {
  const accountType = res.locals.accountData?.account_type;
  if (accountType === "Employee" || accountType === "Admin") {
    return next();
  }
  req.flash("notice", "Access denied. Employees or Admins only.");
  return res.redirect("/account/login");
}

/* ****************************************
 * Middleware to validate form data
 **************************************** */
async function checkData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await getNav();
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData: req.body,
      message: null,
    });
    return;
  }
  next();
}

module.exports = {
  getNav,
  buildVehicleDetail,
  buildClassificationGrid,
  handleErrors,
  checkJWTToken,
  checkLogin,
  checkAccountType,
  checkData,
};
