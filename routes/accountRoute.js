// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accountValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register", 
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
)

// Route to build account view
router.get("/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccount)
)

// LOGOUT
// Route to build Logout view
router.get("/logout", utilities.handleErrors(accountController.logout))

// EDIT ACCOUNT INFORMATION
// Route to build Update-Account view
router.get("/update-account/:account_id", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount))

// Process the update-account-data attempt
router.post(
    "/update-account-data",
    accountValidate.updateDataRules(),
    accountValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccountData)
)

// Process the update password attempt
router.post(
    "/update-account-pswd",
    accountValidate.updatePswdRules(),
    accountValidate.checkUpdatePswd,
    utilities.handleErrors(accountController.updateAccountPswd)
)

module.exports = router;