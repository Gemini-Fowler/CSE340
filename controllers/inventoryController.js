const inventoryModel = require("../models/inventory-model");
const utilities = require("../utilities");

const buildDetailView = async (req, res, next) => {
  try {
    const invId = parseInt(req.params.invId);
    const vehicle = await inventoryModel.getVehicleById(invId);
    if (!vehicle) {
      return next(new Error("Vehicle not found"));
    }
    const nav = await utilities.getNav(); // assuming existing nav builder
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

module.exports = { buildDetailView };
