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

module.exports = invCont