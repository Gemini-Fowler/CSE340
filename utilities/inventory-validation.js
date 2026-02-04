const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Name Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // Classification name is required and must be alphanumeric only
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Classification name is required.")
            .isLength({ min: 1 })
            .withMessage("Classification name must be at least 1 character.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name cannot contain spaces or special characters. Only letters and numbers are allowed.")
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Item Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        // Make is required
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required.")
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters."),

        // Model is required
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters."),

        // Year must be 4 digits
        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be exactly 4 characters.")
            .matches(/^\d{4}$/)
            .withMessage("Year must be 4 digits."),

        // Description is required
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required.")
            .isLength({ min: 1 })
            .withMessage("Description must not be empty."),

        // Image path is required
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required."),

        // Thumbnail path is required
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required."),

        // Price is required and must be numeric
        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .isNumeric()
            .withMessage("Price must be a number.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        // Miles is required and must be numeric
        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required.")
            .isInt({ min: 0 })
            .withMessage("Miles must be a positive integer."),

        // Color is required
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .isLength({ min: 1 })
            .withMessage("Color must not be empty."),

        // Classification ID is required
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Classification is required.")
            .isInt()
            .withMessage("Invalid classification selection.")
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

module.exports = validate
