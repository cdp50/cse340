const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehiclesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    // console.log(data);
    
    res.render("./inventory/classification-view", {
        title: className + "vehicles",
        nav, 
        message: null,
        data,
    })
}

invCont.buildById = async function (req, res, next) {
    const detailId = req.params.detailId;
    let data = await invModel.getVehicleById(detailId)
    let nav = await utilities.getNav();
    const htmlBody = await utilities.getDescription(data)
    const detailName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;

    res.render("./inventory/vehicle-detail", {
        title: detailName,
        nav,
        message: null,
        data,
        htmlBody,
    })
}

module.exports = invCont;