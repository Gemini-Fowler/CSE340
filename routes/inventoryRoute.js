const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const invValidate = require("../utilities/inventory-validation");
const invValidation = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// ✅ New route: Returns inventory data as JSON based on classification ID
router.get("/getInventory/:classification_id", 
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

// ✅ Update existing inventory item
router.post(
  "/update",
  invValidation.updateInventoryRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(inventoryController.updateInventory)
);

// ✅ Delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(inventoryController.buildDeleteConfirmation)
);

// ✅ Perform delete operation
router.post(
  "/delete",
  utilities.handleErrors(inventoryController.deleteInventory)
);

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
  inventoryController.insertClassification
);

// Vehicle insert
router.post(
  "/add-inventory",
  invValidation.addInventoryRules(),
  invValidation.checkAddInventoryData,
  inventoryController.addInventory
);

// Protect management dashboard
router.get("/", utilities.checkAccountType, inventoryController.buildManagement);

// Protect add/edit/delete routes
router.get("/add-classification", utilities.checkAccountType, inventoryController.buildAddClassification);
router.post("/add-classification", utilities.checkAccountType, inventoryController.insertClassification);

router.get("/add-inventory", utilities.checkAccountType, inventoryController.buildAddInventory);
router.post("/add-inventory", utilities.checkAccountType, invValidation.addInventoryRules(), invValidation.checkAddInventoryData, inventoryController.addInventory);

router.post("/update", utilities.checkAccountType, invValidation.updateInventoryRules(), invValidation.checkUpdateData, inventoryController.updateInventory);

router.get("/delete/:inv_id", utilities.checkAccountType, inventoryController.buildDeleteConfirmation);
router.post("/delete", utilities.checkAccountType, inventoryController.deleteInventory);


module.exports = router;
