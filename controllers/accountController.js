const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password,
    } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname, 
        account_lastname, 
        account_email, 
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.redirect("/account/login")
        // res.status(201).render("account/login", {
        //     title: "Login",
        //     nav,
        //     errors: null,
        // })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash(
            "notice",
            `Please check your credentials and try again.`
        )
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return

    } try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            req.session.accountData = accountData; // Asign the account data to the session
            req.session.account_email = accountData.account_email
            req.session.account_id = accountData.account_id

            req.session.save((error) => {
                if (error) {
                    console.error("Error saving session: ", error)
                    return res.status(500).send("Session error")
                }
                const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
                if (process.env.NODE_ENV === 'development') {
                    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
                } else {
                    res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
                }
                return res.redirect("/account/")
            })
            
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: req.session.accountData,
    })
}

/* ****************************************
*  Process logout 
* *************************************** */
async function logout(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "You have been logged out.")

    // Clean the sesion variables
    req.session.loggedin = false;
    req.session.accountData = null;
    // Restore the locals variables
    res.locals.loggedin = false;
    res.locals.accountData = null;

    res.clearCookie("jwt").redirect("/")
    // res.clearCookie("jwt").render("index", {
    //     title: "Home",
    //     nav,
    //     errors: null,
    // })
}

/* ******************************
 * Middleware to check account access
 * ***************************** */
async function checkAccountType(req, res, next) {
    let nav = await utilities.getNav()
    // Check if there is an initiated session, or if the accountType is correct
    if (!req.session.accountData || 
        (req.session.accountData.account_type !== "Admin" && req.session.accountData.account_type !== "Employee")) {
        
        req.flash("notice", "Access denied. You do not have permission to view this page.")
        return res.status(403).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: null,
        })
    } 
    next()
}

/* UPDATE ACCOUNT */
/* ****************************************
*  Deliver update-account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)
    if (!accountData) {
        req.flash("notice", "Sorry, the Account data was lost. Try again please.")
        return res.status(400).render("account/account", {
            title: "Account Management",
            nav,
            errors: null,
        })
    }
    res.render("account/update-account", {
        title: "Edit Account",
        nav,
        errors: null,
        accountData,
    })
}

/* ****************************************
*  Process Update Account Data
* *************************************** */
async function updateAccountData(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const { 
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        } = req.body

        const updateResult = await accountModel.updateAccountData(
            account_firstname,
            account_lastname,
            account_email,
            account_id
        )
        if (updateResult) {
            const updatedAccountData = await accountModel.getAccountById(account_id)
            // Update the session with the new data
            req.session.accountData = updatedAccountData
            // Update locals so it can be displayed in the view
            res.locals.accountData = updatedAccountData

            req.flash("notice", `The account was successfully updated.`)
            res.redirect("/account")
            // res.status(201).render("account/account", {
            //     title: "Account Management",
            //     nav,
            //     errors: null,
            //     accountData: updatedAccountData, // new data
        // })
        } else {
            req.flash("notice", 'Sorry, the insert failed.')
            res.status(501).render("account/update-account", {
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

/* ****************************************
*  Process Update Account Password
* *************************************** */
async function updateAccountPswd(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const { 
            account_password,
            account_id,
        } = req.body

        // Hash the password before storing
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry, there was an error processing the new password.')
            res.status(500).render("account/update-account", {
            title: "Edit Account",
            nav,
            account_id,
            errors: null,
            })
        }

        const updateResult = await accountModel.updateAccountPswd(
            hashedPassword,
            account_id
        )
        if (updateResult) {
            req.flash("notice", `The password was successfully updated.`)
            res.redirect("/account")
        //     res.status(201).render("account/account", {
        //         title: "Account Management",
        //         nav,
        //         errors: null,
        // })
        } else {
            req.flash("notice", 'Sorry, the insert failed.')
            res.status(501).render("account/update-account", {
            title: "Edit Account",
            nav,
            account_id,
            errors: null,
            })
        }
    } catch (error) {
        next(error)   
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildAccount, logout, checkAccountType, buildUpdateAccount, updateAccountData, updateAccountPswd }