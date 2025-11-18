const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const invValidation = require("../utilities/inventory-validation");
const utilities = require("../utilities");
const { check } = require("express-validator");

// ✅ New route: Returns inventory data as JSON based on classification ID
router.get(
  "/type/:classification_id",
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

// Route to build inventory by classification view (HTML)
router.get(
  "/type/html/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

// ✅ Update existing inventory item (protected)
router.post(
  "/update",
  utilities.checkAccountType,
  invValidation.updateInventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(inventoryController.updateInventory)
);

// ✅ Delete confirmation view (protected)
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(inventoryController.buildDeleteConfirmation)
);

// ✅ Perform delete operation (protected)
router.post(
  "/delete",
  utilities.checkAccountType,
  utilities.handleErrors(inventoryController.deleteInventory)
);

// Route to display vehicle details by ID
router.get("/detail/:invId", inventoryController.buildDetailView);

// Management dashboard (protected)
router.get("/", utilities.checkAccountType, inventoryController.buildManagement);

// Classification form (protected)
router.get("/add-classification", utilities.checkAccountType, inventoryController.buildAddClassification);

// Inventory form (protected)
router.get("/add-inventory", utilities.checkAccountType, inventoryController.buildAddInventory);

// Classification insert (protected)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  [
    check("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must only contain letters and numbers.")
      .notEmpty()
      .withMessage("Classification name is required.")
  ],
  inventoryController.insertClassification
);

// Vehicle insert (protected)
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidation.addInventoryRules(),
  invValidation.checkAddInventoryData,
  inventoryController.addInventory
);

module.exports = router;