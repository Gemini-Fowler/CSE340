const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryById(inv_id)
    const detail = await utilities.buildDetailView(vehicle)
    let nav = await utilities.getNav()
    if (!vehicle) {
        res.status(404).render("errors/error", {
            title: 404,
            message: 'Sorry, that vehicle could not be found.',
            nav,
        })
        return
    }
    const title = vehicle.inv_make + " " + vehicle.inv_model
    res.render("./inventory/detail", {
        title,
        nav,
        detail,
    })
}

/* ***************************
 *  Intentional error route for testing
 * ************************** */
invCont.throwError = async function (req, res, next) {
    // throw an error to test the error handler
    throw new Error('Intentional server error for testing')
}

module.exports = invCont
