const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const invValidate = {};

// Classification rules
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification must not contain spaces or special characters.")
  ];
};

// Classification validation handler
invValidate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await require("../utilities").getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      message: req.flash("notice"),
      classification_name
    });
    return;
  }
  next();
};

// Inventory validation rules
invValidate.addInventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Valid year is required."),
    body("inv_description").trim().isLength({ min: 1 }).withMessage("Description required."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Image path required."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Thumbnail path required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a number."),
    body("inv_miles").isFloat({ min: 0 }).withMessage("Miles must be a number."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Color required."),
    body("classification_id").isInt().withMessage("Please select a classification.")
  ];
};

// Inventory validation handler
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

module.exports = invValidate;
