// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const favoritesController = require("../controllers/favoritesController");

// Route to build my favorites view
router.get(
    "/my-favorites",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.buildMyFavorites)
);

// Route to add vehicle to favorites
router.post(
    "/add",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.addFavorite)
);

// Route to remove vehicle from favorites
router.post(
    "/remove",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.removeFavorite)
);

module.exports = router;
