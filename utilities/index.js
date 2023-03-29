const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.buildNav = function (data) {
  let list = "<ul class='nav'>"
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
/* ************************
 * Builds the navigation bar
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  nav = Util.buildNav(data)
  return nav
}

/* ************************
 * Constructs the dropdown HTML
 ************************** */
Util.getDropdown = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  var isSelected = "selected";
  classification_id != null ? isSelected = "":isSelected = "selected";
  let list = `<select name="classification_id" id="classification_id" required>`
  list += `<option value='' disabled ${isSelected}>Choose a Classification</option>`
  data.rows.forEach((row) => {
    list += `<option value=${row.classification_id} `
    if(classification_id != null && row.classification_id == classification_id){
      list+= " selected "
      isSelected = ""
    }
    list += `>${row.classification_name}</option>` 
  })
  list += '</select>'
  return list
}

/* ************************
* Constructs the HTML body of the vehicle description
 ************************** */
Util.buildDescription = function (data1) {
  const data = data1[0]
  let detail = "<div class='detailImg'>"
  detail += `<img src= ${data.inv_image}  alt=${data.inv_make + data.inv_model}>` +
  "</div>" +
  "<div class='detailDescription'>" +
  `<h2>${data.inv_make + " " + data.inv_model} Details</h2>` +
  `<h2> Price: $${new Intl.NumberFormat("en-US").format(data.inv_price)}</h2>`+
  `<p><span class='detail'>Description: </span>${data.inv_description}</p>`+
  `<p><span class='detail'>Color: </span>${data.inv_color}</p>`+
  `<p><span class='detail'>Miles: </span>${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>` +
  "</div>" 
  return detail
}

/* ************************
 * Builds the vehicle description
 ************************** */
Util.getDescription = async function (data) {
  
  const description = await Util.buildDescription(data)

  return description
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err) {
    if (err) {
      return res.status(403).redirect("/clients/login")
    }
  return next()
  })
}

/* ****************************************
 *  Authorize JWT Token
 * ************************************ */
Util.jwtAuth = (req, res, next) => {
  const token = req.cookies.jwt
  try {
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.clientData = clientData

    next()
  } catch (error){
    res.clearCookie("jwt", { httpOnly: true })
    return res.status(403).redirect("/")
  }
}

/* ****************************************
* Middleware to check if there is a cookie
**************************************** */

Util.checkClientLogin = ( req, res, next )=> {
  if(req.cookies.jwt){
    res.locals.loggedIn = 1
    next()
  }else{
    next()
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util