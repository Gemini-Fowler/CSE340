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
