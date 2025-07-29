const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route to display vehicle details by ID
router.get("/detail/:invId", inventoryController.buildDetailView);
router.get("/", inventoryController.buildManagement)
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventory);


router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  invController.insertClassification
)

router.post("/add-inventory", invValidation.addInventoryRules(), invValidation.checkAddInventoryData, invController.addInventory);


module.exports = router;
