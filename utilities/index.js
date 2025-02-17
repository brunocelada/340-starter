const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleHTML = async function (vehicle){
  let grid = ''
  if(vehicle) {
    grid += '<div class="vehicle-detail">'
    grid += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
    grid += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    grid += '<div class="vehicle-info">'
    grid += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
    grid += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    grid += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
    grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    grid += '</div>'
    grid += '</div>'
    grid += '<br><a id="compare-link" href="/inv/compare/' + vehicle.inv_id + '" title="Compare this vehicle with another">Compare Vehicle</a>' // ENHANCEMENT <--------------------
  } else {
    grid += '<p class="notice">Sorry, we could not find that vehicle.</p>'
  }
  return grid
}

/* **************************************
* Build the management view HTML
* ************************************ */
Util.buildManagementHTML = async function (req, res, next) {
  let list = '<div id="management-links">'
  list += '<a href="/inv/add-classification" title="Add New Classification">Add New Classification</a>'
  list += '<br><br>'
  list += '<a href="/inv/add-vehicle" title="Add New Vehicle">Add New Vehicle</a>'
  list += '</div>'
  return list
}

/* **************************************
* Build the classification list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null, selectId = "classificationList") { // ENHANCEMENT <------------
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="'+ selectId + '" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

// ENHANCEMENT <----------------------------------------------------------------
/* **************************************
* Build the vehicle list
* ************************************ */
Util.buildVehicleList = async function (inv_id = null, selectId = "vehicleList") {
  let selectedVehicle = await invModel.getVehicleById(inv_id)

  let vehicleList = `<select disabled name="vehicle_id" id="${selectId}" required>`

  // Validate if data is a valid object
  if (!selectedVehicle || Object.keys(selectedVehicle).length === 0) {
    console.warn("No vehicle data available.")
    vehicleList += "<option value=''>Choose a Vehicle</option>"
    vehicleList += "</select>"
    return vehicleList
  }

  let classification_id = selectedVehicle.classification_id
  let data = await invModel.getInventoryByClassificationId(classification_id)

  vehicleList += "<option value=''>Choose a Vehicle</option>"
  
  data.forEach((row) => {
    vehicleList += '<option value="' + row.inv_id + '"'
    if (
      inv_id != null &&
      row.inv_id == inv_id
    ) {
      vehicleList += " selected "
    }
    vehicleList += ">" + row.inv_make + " " + row.inv_model + "</option>"
  })

  vehicleList += "</select>"
  return vehicleList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     // Update the changes in the account data
     const updatedAccountData = await accountModel.getAccountById(accountData.account_id)
     res.locals.accountData = updatedAccountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util