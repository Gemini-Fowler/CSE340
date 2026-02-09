const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities/");

const favoritesCont = {};

/* ***************************
 *  Add vehicle to favorites
 * ************************** */
favoritesCont.addFavorite = async function (req, res, next) {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;

    const addResult = await favoritesModel.addFavorite(account_id, inv_id);

    if (addResult && addResult.favorite_id) {
        req.flash("notice", "Vehicle added to your favorites!");
        res.status(200).json({ success: true, message: "Added to favorites" });
    } else if (addResult === null) {
        res.status(400).json({ success: false, message: "Vehicle is already in your favorites" });
    } else {
        req.flash("notice", "Sorry, adding to favorites failed.");
        res.status(500).json({ success: false, message: "Failed to add favorite" });
    }
};

/* ***************************
 *  Remove vehicle from favorites
 * ************************** */
favoritesCont.removeFavorite = async function (req, res, next) {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;

    const removeResult = await favoritesModel.removeFavorite(account_id, inv_id);

    if (removeResult > 0) {
        req.flash("notice", "Vehicle removed from your favorites.");
        res.status(200).json({ success: true, message: "Removed from favorites" });
    } else {
        req.flash("notice", "Sorry, removing from favorites failed.");
        res.status(500).json({ success: false, message: "Failed to remove favorite" });
    }
};

/* ***************************
 *  Build my favorites view
 * ************************** */
favoritesCont.buildMyFavorites = async function (req, res, next) {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;

    const favorites = await favoritesModel.getFavoritesByAccountId(account_id);

    let favoritesGrid = "";
    if (Array.isArray(favorites) && favorites.length > 0) {
        favoritesGrid = await utilities.buildFavoritesGrid(favorites);
    } else {
        favoritesGrid = '<p class="notice">You have no favorite vehicles yet. Browse our <a href="/inv">inventory</a> to add some!</p>';
    }

    res.render("./favorites/my-favorites", {
        title: "My Favorite Vehicles",
        nav,
        favoritesGrid,
        errors: null,
    });
};

module.exports = favoritesCont;
