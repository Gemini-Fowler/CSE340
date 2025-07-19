const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route to display vehicle details by ID
router.get("/detail/:invId", inventoryController.buildDetailView);

module.exports = router;
