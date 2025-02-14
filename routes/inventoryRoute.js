// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the detailed vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailView));

// MANAGEMENT VIEWS ************
// *****************************

// Route to build the management view
router.get("/", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.buildManagementView)
);

// ADD CLASSIFICATION **********
// *****************************

// Route to build add-classification view
router.get("/add-classification", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.buildAddClassificationView));

// Process the "add-classification" data
router.post(
    "/add-classification",
    utilities.checkLogin,
    accountController.checkAccountType,
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

// ADD VEHICLES ****************
// *****************************

// Route to build add-vehicle view
router.get("/add-vehicle", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.buildAddVehicleView));

// Process the "add-vehicle" data
router.post(
    "/add-vehicle",
    utilities.checkLogin,
    accountController.checkAccountType,
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

// UPDATE OR DELETE VEHICLES ***
// *****************************

// Route to build the "getInventory" views
router.get("/getInventory/:classification_id", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory views
router.get("/edit/:inv_id", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.editInventoryView))

// Process the "update-vehicle" data
router.post(
    "/edit-inventory",
    utilities.checkLogin,
    accountController.checkAccountType,
    invValidate.addVehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to build the delete inventory views
router.get("/delete/:inv_id", 
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryView))

// Process the "delete-vehicle" data
router.post(
    "/delete-confirm",
    utilities.checkLogin,
    accountController.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;