const invValidate = {};


invValidate.addInventoryRules = function () {
  const { body } = require("express-validator");
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits."),
  ];
};

// Inventory validation handler for adding new inventory
invValidate.checkAddInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications();
    const nav = await require("../utilities").getNav();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors,
      message: "Please correct the errors below.",
      ...req.body,
      classifications
    });
    return;
  }
  next();
};

invValidate.updateInventoryRules = function () {
  const { body } = require("express-validator");
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits."),
    // Add more validation rules as needed
  ];
};

// Inventory validation handler for updating inventory
// If errors exist, redirect back to the edit view with sticky data
invValidate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  const {
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
  } = req.body;

  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications();
    const nav = await require("../utilities").getNav();
    res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      errors,
      message: "Please correct the errors below.",
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
      classification_id,
      classifications
    });
    return;
  }
  next();
};
module.exports = invValidate;