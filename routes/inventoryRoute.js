// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagementView))

// Route to return inventory data as JSON
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON))

// Route to build add classification view
router.get("/add-classification", utilities.checkEmployeeAdmin, utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification
router.post(
    "/add-classification",
    utilities.checkEmployeeAdmin,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.checkEmployeeAdmin, utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    utilities.checkEmployeeAdmin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkEmployeeAdmin, utilities.handleErrors(invController.editInventoryView))

// Route to process update inventory
router.post(
    "/update",
    utilities.checkEmployeeAdmin,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.checkEmployeeAdmin, utilities.handleErrors(invController.deleteConfirmView))

// Route to process delete inventory
router.post(
    "/delete",
    utilities.checkEmployeeAdmin,
    utilities.handleErrors(invController.deleteInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router