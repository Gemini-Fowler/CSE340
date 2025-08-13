const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");

const invController = {};

// Build inventory by classification view (HTML)
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await inventoryModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Vehicles";
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

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
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice"),
    classificationSelect
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
      const updatedNav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList();
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: updatedNav,
        message: req.flash("notice"),
        classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await inventoryModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.editInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();

  const itemData = await inventoryModel.getVehicleById(inv_id);

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await inventoryModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 * Deliver the delete confirmation view
 * ************************** */
invController.buildDeleteConfirmation = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await inventoryModel.getVehicleById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: `Delete ${itemName}`,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 * Process the inventory deletion
 * ************************** */
invController.deleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id);
  const nav = await utilities.getNav();

  try {
    const result = await inventoryModel.deleteInventoryItem(inv_id);

    if (result) {
      req.flash("notice", "The inventory item was successfully deleted.");
    } else {
      req.flash("notice", "Sorry, the delete failed. Please try again.");
    }

    res.redirect("/inv/");
  } catch (error) {
    console.error("Delete error:", error);
    req.flash("notice", "Server error. Try again later.");
    res.redirect("/inv/");
  }
};

/* ***************************
 * Deliver delete confirmation view
 * *************************** */
invController.buildDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await inventoryModel.getInventoryItemById(inv_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    item: itemData,
    errors: null,
  });
};

/* ***************************
 * Process the inventory deletion
 * *************************** */
invController.deleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id);
  const nav = await utilities.getNav();

  try {
    const result = await inventoryModel.deleteInventoryItem(inv_id);

    if (result) {
      req.flash("notice", "The inventory item was successfully deleted.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the delete failed. Please try again.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    req.flash("notice", "Server error. Try again later.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
};


// At the end of controllers/inventoryController.js
module.exports = invController;