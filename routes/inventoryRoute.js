// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the detailed vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailView));

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// ADD CLASSIFICATION **********
// *****************************

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Process the "add-classification" data
router.post(
    "/add-classification", 
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

// ADD VEHICLES ****************
// *****************************

// Route to build add-vehicle view
router.get("/add-vehicle", utilities.handleErrors(invController.buildAddVehicleView));

// Process the "add-vehicle" data
router.post(
    "/add-vehicle", 
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

module.exports = router;