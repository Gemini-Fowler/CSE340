const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const invValidate = require("../utilities/inventory-validation"); // Add this if missing
const invValidation = require("../utilities/inventory-validation"); // Same here

// Route to display vehicle details by ID
router.get("/detail/:invId", inventoryController.buildDetailView);

// Management dashboard
router.get("/", inventoryController.buildManagement);

// Classification form
router.get("/add-classification", inventoryController.buildAddClassification);

// Inventory form
router.get("/add-inventory", inventoryController.buildAddInventory);

// Classification insert
router.post("/add-classification",
  [
    check("classification_name")
      .trim()
      .isAlphanumeric()
      .withMessage("Classification name must only contain letters and numbers.")
      .notEmpty()
      .withMessage("Classification name is required.")
  ],
  invController.insertClassification
);

// Vehicle insert
router.post(
  "/add-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkAddInventoryData,
  inventoryController.addInventory
);

module.exports = router;
