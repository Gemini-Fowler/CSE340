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
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  inventoryController.insertClassification
);

// Vehicle insert
router.post(
  "/add-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkAddInventoryData,
  inventoryController.addInventory
);

module.exports = router;
