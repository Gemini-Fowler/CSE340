// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

// Route to build inventory detail view
router.get(
    "/detail/:invId",
    utilities.handleErrors(invController.buildByInvId)
)

// Route to intentionally trigger a server error (for testing)
router.get(
    "/trigger-error",
    utilities.handleErrors(invController.throwError)
)

module.exports = router
