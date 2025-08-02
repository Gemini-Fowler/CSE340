const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");

const invController = {};

// View vehicle details
invController.buildDetailView = async (req, res, next) => {
  try {
    const invId = parseInt(req.params.invId);
    const vehicle = await inventoryModel.getVehicleById(invId);
    if (!vehicle) return next(new Error("Vehicle not found"));

    const nav = await utilities.getNav();
    const detailHTML = utilities.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML,
    });
  } catch (error) {
    next(error);
  }
};

// Management view
invController.buildManagement = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
  });
};

// Classification form view
invController.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
};

// Insert new classification with validation
invController.insertClassification = async (req, res) => {
  const errors = validationResult(req);
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array()
    });
  }

  try {
    const result = await inventoryModel.addClassification(classification_name);

    if (result) {
      req.flash("notice", `Successfully added "${classification_name}" classification.`);
      const updatedNav = await utilities.getNav(); // refresh nav to include new classification
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: updatedNav,
        message: req.flash("notice"),
      });
    } else {
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: "Classification creation failed.",
        errors: null
      });
    }
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: "Server error. Try again later.",
      errors: null
    });
  }
};

// Inventory form view
invController.buildAddInventory = async (req, res, next) => {
  try {
    const classifications = await inventoryModel.getClassifications();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      classifications,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

// Insert new vehicle
invController.addInventory = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color, classification_id
  } = req.body;

  try {
    const result = await inventoryModel.addInventoryItem({
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color, classification_id
    });

    if (result) {
      req.flash("message", "New vehicle successfully added.");
      res.redirect("/inv/add-inventory");
    } else {
      req.flash("message", "Failed to add vehicle. Try again.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invController;
