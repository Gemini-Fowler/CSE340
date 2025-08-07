const pool = require("../database");
const jwt = require("jsonwebtoken")
require("dotenv").config()
/**
 * Build a dynamic navigation menu from the 'classification' table.
 */
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
      nav += `<li><a href="/inventory/type/${row.classification_id}">${row.classification_name}</a></li>`;
    });

    nav += `<li><a href="/error/trigger">Trigger Error</a></li>`;
    nav += "</ul>";
    return nav;
  } catch (error) {
    console.error("Error building navigation menu:", error);
    // Fallback minimal nav
    return `
      <ul class="main-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
        <li><a href="/error/trigger">Trigger Error</a></li>
      </ul>
    `;
  }
};

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

/**
 * Middleware to catch errors in async controller functions
 */
function handleErrors(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = {
  getNav,
  buildVehicleDetail,
  handleErrors,
};
