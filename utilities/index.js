const invModel = require("../models/inventory-model")
const Util = {}

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
Util.buildDropdown = function (data) {
  let list = '<select name="classification_id" id="classification_id">'
  data.rows.forEach((row) => {
    list += `<option value=${row.classification_id}>${row.classification_name}</option>`
  })
  list += '</select>'
  return list
}

/* ************************
 * Builds the dropdown menu
 ************************** */
Util.getDropdown = async function (req, res, next) {
  let data = await invModel.getClassifications()
  dropdown = Util.buildDropdown(data)
  return dropdown
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


module.exports = Util