const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehiclesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    
    res.render("./inventory/classification-view", {
        title: className + " vehicles",
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

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    let title = "Vehicle Management";
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";

    res.render("./inventory/management-view", {
        title: title,
        nav,
        message: null,
        addNewClassification: addClassification,
        addNewVehicle: addVehicle,
    })
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    let title = "Add New Classification";

    res.render("./inventory/add-classification", {
        title: title,
        nav, 
        message: null,
        errors: null,
    })
}


invCont.addClassification = async function (req, res, next) {
    let title = "Vehicle Management";
    const { classificationName } = req.body;
    const result = await invModel.addClassification(classificationName);
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";
    let nav = await utilities.getNav();
    if(result){
        res.status(201).render("./inventory/management-view", {
            title: title,
            nav, 
            message: `Classification ${classificationName} has been successfully added.`,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
        })
    } else {
        const message = "Sorry, the new classification registration failed."
        res.status(501).render("./inventory/management-view", {
            title: title,
            nav,
            message,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
        })
    }
}

invCont.buildAddVehicle = async function (req, res, next) {
    let title = "Add New Vehicle";
    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropdown();

    res.render("./inventory/add-vehicle", {
        title: title,
        nav, 
        dropdown,
        message: null,
        errors: null,
    })
}

invCont.addVehicle = async function (req, res, next) {
    let title = "Add New Vehicle";
    const { 
        classification_id, 
        inv_make,
        inv_model,
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        } = req.body;

    const result = await invModel.addVehicle(
        classification_id, 
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color,
        );
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";
    let nav = await utilities.getNav();
    if(result){
        res.status(201).render("./inventory/management-view", {
            title: title,
            nav, 
            message: `Vehicle ${inv_make} ${inv_model} has been successfully added.`,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
        })
    } else {
        const message = "Sorry, the new vehicle registration failed."
        res.status(501).render("./inventory/management-view", {
            title: title,
            nav,
            message,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
        })
    }
}

module.exports = invCont;