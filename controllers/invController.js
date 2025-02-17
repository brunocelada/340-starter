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
        // Create a select list to display the classification list
        const classificationSelect = await utilities.buildClassificationList()
        // Build the management HTML
        let grid = await utilities.buildManagementHTML()
        
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            grid,
            classificationSelect,
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
            let classificationSelect = await utilities.buildClassificationList() // Build the classification list HTML

            req.flash(
                "notice",
                `Congratulations, the classification ${classification_name} was added.`
            )
            res.status(201).render("./inventory/management", {
                title: "Management",
                nav,
                errors: null,
                grid,
                classificationSelect,
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
        const classificationSelect = await utilities.buildClassificationList() // Build the classification list HTML
        res.render("./inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            classificationSelect,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Process Add New Vehicle
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
        let classificationSelect = await utilities.buildClassificationList() // Build the classification list HTML

        if (vehicleResult) {
            req.flash(
                "notice",
                `Congratulations, the vehicle ${inv_make} ${inv_model} was added.`
            )
            res.status(201).render("./inventory/management", {
                title: "Management",
                nav,
                classificationSelect,
                errors: null,
                grid,
            })        
        } else {
            req.flash("notice", 'Sorry, there was an error processing the new vehicle.')
            res.status(501).render("./inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)    
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

/* ****************************************
*  Build edit-inventory view
* *************************************** */
invCont.editInventoryView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()

        const inv_id = parseInt(req.params.inv_id)
        // Validate that ID is a valid number, before the consult
        if (isNaN(inv_id)) {
            throw new Error("Invalid vehicle ID: NaN")
        }

        const itemData = await invModel.getVehicleById(inv_id)
        const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`

        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_description: itemData.inv_description,
            inv_image: itemData.inv_image,
            inv_thumbnail: itemData.inv_thumbnail,
            inv_price: itemData.inv_price,
            inv_miles: itemData.inv_miles,
            inv_color: itemData.inv_color,
            classification_id: itemData.classification_id
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Process Update Vehicle Data
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
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
            inv_id,
        } = req.body

        const updateResult = await invModel.updateInventory(
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
            inv_id
        )
        
        let nav = await utilities.getNav()
        
        if (updateResult) {
            const itemName = updateResult.inv_make + " " + updateResult.inv_model
            req.flash("notice", `The ${itemName} was successfully updated.`)
            res.redirect("/inv/")        
        } else {
            const classificationSelect = await utilities.buildClassificationList(classification_id) // Build the classification list HTML
            const itemName = `${inv_make} ${inv_model}`
            req.flash("notice", 'Sorry, the insert failed.')
            res.status(501).render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
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
            inv_id,
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

/* ****************************************
*  Build Delete View
* *************************************** */
invCont.deleteInventoryView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()

        const inv_id = parseInt(req.params.inv_id)
        // Validate that ID is a valid number, before the consult
        if (isNaN(inv_id)) {
            throw new Error("Invalid vehicle ID: NaN")
        }

        const itemData = await invModel.getVehicleById(inv_id)
        const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`

        res.render("./inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_price: itemData.inv_price
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Process Delete Vehicle
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
    try {
        const {
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_id
        } = req.body

        let deleted_make = inv_make
        let deleted_model = inv_model
        const itemName = `${deleted_make} ${deleted_model}`

        const deleteResult = await invModel.deleteInventory(inv_id)
        
        let nav = await utilities.getNav()
        
        if (deleteResult) {
            req.flash("notice", `The ${itemName} was successfully deleted.`)
            res.redirect("/inv/")        
        } else {
            req.flash("notice", 'Sorry, the insert failed.')
            res.status(501).render("./inventory/delete-confirm", {
            title: "Edit " + itemName,
            nav,
            inv_make,
            inv_model,
            inv_year, 
            inv_price,
            inv_id,
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

// ENHANCEMENT <-----------------------------------------------------------
/* ***************************
 *  Build compare vehicles view
 * ************************** */
invCont.buildCompareVehiclesView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        
        const itemId = parseInt(req.params.inv_id)
        if (isNaN(itemId)) {
            throw new Error("Invalid vehicle ID: NaN")
        }
        const itemData = await invModel.getVehicleById(itemId)
        const classificationId = itemData.classification_id
        
        // Build the 2 classification lists
        const classificationList1 = await utilities.buildClassificationList(classificationId, "classificationList1")
        const classificationList2 = await utilities.buildClassificationList(null, "classificationList2")

        // Build the 2 vehicles list
        const vehicleList1 = await utilities.buildVehicleList(itemId, "vehicleList1")
        const vehicleList2 = await utilities.buildVehicleList(null, "vehicleList2")

        res.render("./inventory/compare", {
            title: "Vehicle Comparation",
            nav,
            classificationList1,
            classificationList2,
            vehicleList1,
            vehicleList2,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Return Inventory Details by inventory_id As JSON
 * ************************** */
invCont.getVehicleJSON = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    const invData = await invModel.getVehicleById(inv_id)
    if (invData.inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

module.exports = invCont