const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Build detailed vehicle view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
    try {
        const vehicleId = req.params.vehicleId
        const vehicleData = await invModel.getVehicleById(vehicleId) // To get the vehicle data

        let nav = await utilities.getNav()
        const grid = await utilities.buildVehicleHTML(vehicleData) // Build the vehicle HTML
        res.render("./inventory/details", {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
            nav,
            grid,
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let grid = await utilities.buildManagementHTML() // Build the management HTML
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            grid,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Build Add-Classification view
* *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Process Add New Classification
* *************************************** */
invCont.addNewClassification = async function (req, res, next) {
    try {
        const { 
            classification_name,
        } = req.body

        const classificationResult = await invModel.addNewClassification(classification_name)
        
        let nav = await utilities.getNav()
        let grid = await utilities.buildManagementHTML()

        if (classificationResult) {
            req.flash(
                "notice",
                `Congratulations, the classification ${classification_name} was added.`
            )
            res.status(201).render("./inventory/management", {
                title: "Management",
                nav,
                errors: null,
                grid,
            })        
        } else {
            req.flash("notice", 'Sorry, there was an error processing the new classification.')
            res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

/* ****************************************
*  Build Add-Vehicle view
* *************************************** */
invCont.buildAddVehicleView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let list = await utilities.buildClassificationList() // Build the classification list HTML
        res.render("./inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            list,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Process Add New Classification
* *************************************** */
invCont.addNewVehicle = async function (req, res, next) {
    try {
        const { 
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
        } = req.body

        const vehicleResult = await invModel.addNewVehicle(
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_image,
            inv_thumbnail,
            inv_description
        )
        
        let nav = await utilities.getNav()
        let grid = await utilities.buildManagementHTML()
        let list = await utilities.buildClassificationList() // Build the classification list HTML

        if (vehicleResult) {
            req.flash(
                "notice",
                `Congratulations, the vehicle ${inv_make} ${inv_model} was added.`
            )
            res.status(201).render("./inventory/management", {
                title: "Management",
                nav,
                errors: null,
                grid,
            })        
        } else {
            req.flash("notice", 'Sorry, there was an error processing the new vehicle.')
            res.status(501).render("./inventory/add-vehicle", {
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
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

module.exports = invCont