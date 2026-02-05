const invModel = require("../models/inventory-model")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification view HTML
*************************************** */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 *************************************** */
Util.buildVehicleDetail = function (data) {
    let detail = '<div class="vehicle-detail-container">'
    detail += '<div class="vehicle-image">'
    detail += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
    detail += '</div>'
    detail += '<div class="vehicle-info">'
    detail += '<h2>' + data.inv_make + ' ' + data.inv_model + '</h2>'
    detail += '<p class="vehicle-price">Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    detail += '<p class="vehicle-year">Year: ' + data.inv_year + '</p>'
    detail += '<p class="vehicle-mileage">Mileage: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
    detail += '<hr />'
    detail += '<h3>Vehicle Details</h3>'
    detail += '<ul class="details-list">'
    detail += '<li><strong>Make:</strong> ' + data.inv_make + '</li>'
    detail += '<li><strong>Model:</strong> ' + data.inv_model + '</li>'
    detail += '<li><strong>Year:</strong> ' + data.inv_year + '</li>'
    detail += '<li><strong>Color:</strong> ' + data.inv_color + '</li>'
    detail += '<li><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</li>'
    detail += '<li><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    detail += '<li><strong>Description:</strong> ' + data.inv_description + '</li>'
    detail += '</ul>'
    detail += '</div>'
    detail += '</div>'
    return detail
}

/* **************************************
 * Build classification list dropdown
 *************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 * Middleware For Handling JWT Token
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        const jwt = require("jsonwebtoken")
        const { ACCESS_TOKEN_SECRET } = process.env
        jwt.verify(req.cookies.jwt, ACCESS_TOKEN_SECRET, (err, accountData) => {
            if (err) {
                req.flash("notice", "Your session has expired, please log in again.")
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

/* ****************************************
 *  Check Employee or Admin
 * ************************************ */
Util.checkEmployeeAdmin = (req, res, next) => {
    if (res.locals.loggedin) {
        const { account_type } = res.locals.accountData
        if (account_type === "Employee" || account_type === "Admin") {
            next()
        } else {
            req.flash("notice", "You do not have permission to access that resource.")
            return res.redirect("/account/login")
        }
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util   // <-- EXPORT AT THE VERY END
