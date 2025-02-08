const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        // classification name is required and must be an alphabetic string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Please provide a valid classification name.") // on error this message is sent.
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists){
                    throw new Error("Classification exists. Please add a different classification name.")
                }
            }),
    ]
}

/* ******************************
 * Check data and return errors or continue to "add classification"
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
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
  *  New Vehicle Data Validation Rules
  * ********************************* */
validate.addVehicleRules = () => {
    return [
        // classification id is required and must be an integer
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a valid classification name."), // on error this message is sent.

        // inventory make is required and must be a string
        body("inv_make")
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .isString()
            .withMessage("Please provide a valid inventory make."), // on error this message is sent.

        // inventory model is required and must be a string
        body("inv_model")
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .isString()
            .withMessage("Please provide a valid inventory model."), // on error this message is sent.

        // inventory year is required and must be a 4 digit number
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 , max: 4 })
            .isNumeric()
            .isInt()
            .withMessage("Please provide a valid inventory year."), // on error this message is sent.

        // inventory price is required and must be an integer or decimal number
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a valid inventory price."), // on error this message is sent.

        // inventory miles is required and must be an integer number
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a valid inventory miles."), // on error this message is sent.

        // inventory color is required and must be an alphabetic string
        body("inv_color")
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isString()
            .withMessage("Please provide a valid inventory color."), // on error this message is sent.

        // inventory image path is required and must be a valid link
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid inventory image path."), // on error this message is sent.

        // inventory thumbnail is required and must be a valid link
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid inventory thumbnail path."), // on error this message is sent.

        // inventory description is required and must be a valid string
        body("inv_description")
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isString()
            .withMessage("Please provide a valid inventory description."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to "add vehicle"
 * ***************************** */
validate.checkAddVehicleData = async (req, res, next) => {
    const { classification_id,
        inv_make,
        inv_model,
        inv_year, 
        inv_price,
        inv_miles,
        inv_color,
        inv_image,
        inv_thumbnail,
        inv_description,
    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let list = await utilities.buildClassificationList() // Build the classification list HTML
      res.render("inventory/add-vehicle", {
        errors,
        title: "Add New Vehicle",
        nav,
        list,
        classification_id,
        inv_make,
        inv_model,
        inv_year, 
        inv_price,
        inv_miles,
        inv_color,
        inv_image,
        inv_thumbnail,
        inv_description,
      })
      return
    }
    next()
}
  
module.exports = validate