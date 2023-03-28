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
    const classificationSelect = await utilities.getDropdown();
    let title = "Vehicle Management";
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";
    
    if(req.clientData.client_type == "Admin" || req.clientData.client_type == "Employee"){
        res.render("./inventory/management-view", {
            title: title,
            nav,
            message: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
            classificationSelect,
        })
    } else if(req.clientData.client_type == "Client" || req.clientData.client_type == undefined){
        res.render("clients/login", {
            title: `Access Denied`,
            nav,
            message: "you do not have access to this area",
            errors: null,
            client_email: null,
        })
    }
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    let title = "Add New Classification";

    if(req.clientData.client_type == "Admin" || req.clientData.client_type == "Employee"){
        res.render("./inventory/add-classification", {
            title: title,
            nav,
            message: null,
            errors:null,
        })
    } else if(req.clientData.client_type == "Client" || req.clientData.client_type == undefined){
        res.render("clients/login", {
            title: `Access Denied`,
            nav,
            message: "you do not have access to this area",
            errors: null,
            client_email: null,
        })
    }
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
            classificationSelect: null
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
            classificationSelect: null
        })
    }
}
/* ***************************
 *  deliver the add new vehicle 
 *  view if you have the right client_type
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let title = "Add New Vehicle";
    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropdown();
    if(req.clientData.client_type == "Admin" || req.clientData.client_type == "Employee"){
        res.render("./inventory/add-vehicle", {
            title: title,
            nav,
            dropdown,
            message: null,
            errors: null,
        })
    } else if(req.clientData.client_type == "Client" || req.clientData.client_type == undefined){
        res.render("clients/login", {
            title: `Access Denied`,
            nav,
            message: "you do not have access to this area",
            errors: null,
            client_email: null,
        })
    }
}

/* ***************************
 *  manage the post by adding the new vehicle to the DB
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
    let title = "Add New Vehicle";
    const { 
        classification_id, inv_make,inv_model,inv_year, 
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
        } = req.body;
    let dropdown = await utilities.getDropdown();
    const result = await invModel.addVehicle(classification_id, inv_make, inv_model, 
        inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,);
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
            classificationSelect: dropdown,
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
            classificationSelect: dropdown,
        })
    }
}

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const vehicleData = await invModel.getVehiclesByClassificationId(classification_id)
    if (vehicleData[0].inv_id) {
      return res.json(vehicleData)
    } else {
      next(new Error("No data returned"))
    }
  }

/* ***************************
 *  delivers the edit vehicle view
 * ************************** */
invCont.editDetailId = async function (req, res, next) {
    res.locals.detailId = parseInt(req.params.detailId);
    let nav = await utilities.getNav();
    let [data] = await invModel.getVehicleById(res.locals.detailId)
    console.log("this is the get vehicle by id data I want to know if it comes with the classification id");
    console.log(data);
    let title = "Edit " + data.inv_make + " " + data.inv_model;
    let dropdown = await utilities.getDropdown(data.classification_id);
    if(req.clientData.client_type == "Admin" || req.clientData.client_type == "Employee"){
        res.render("./inventory/edit-vehicle", {
            title: title,
            nav,
            dropdown,
            message: null,
            errors: null,
            validationErrors: null,
            inv_id: res.locals.detailId,
            inv_make: data.inv_make,
            inv_model: data.inv_model,
            inv_year: data.inv_year,
            inv_description: data.inv_description,
            inv_image: data.inv_image,
            inv_thumbnail: data.inv_thumbnail,
            inv_price: data.inv_price,
            inv_miles: data.inv_miles,
            inv_color: data.inv_color,
            classification_id: data.classification_id
        })
    } else if(req.clientData.client_type == "Client" || req.clientData.client_type == undefined){
        res.render("clients/login", {
            title: `Access Denied`,
            nav,
            message: "you do not have access to this area",
            errors: null,
            client_email: null,
        })
    }
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropdown();
    const title = "Edit Vehicle";
    var { 
        classification_id, inv_make,inv_model,inv_year, 
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id
    } = req.body;
    inv_miles = parseInt(inv_miles);
    classification_id = parseInt(classification_id);
    let dropdownSelected = await utilities.getDropdown(classification_id);

        // this is an attempt to return an error message if no change to the form has been done. 
        // but it won't work because inv_miles and classification_id are int at the database.
    const formData = {inv_make, inv_model, inv_price, inv_description, inv_color, inv_miles, inv_image, inv_thumbnail, inv_year, classification_id}
    let [dbData] = await invModel.getVehicleById(inv_id)
    // console.log(JSON.stringify(dbData))
    // console.log(JSON.stringify(formData))
    // console.log(JSON.stringify(dbData) == JSON.stringify(formData))
    console.log("this is the update vehicle change check")
    console.log(JSON.stringify(dbData) === JSON.stringify(formData))
    if(JSON.stringify(dbData) === JSON.stringify(formData)){
        const errors = "No change detected, make sure to edit the vehicle information";
        res.render("./inventory/edit-vehicle", {
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            dropdown: dropdownSelected,
            message: null,
            validationErrors: null,
            errors,
            inv_id: inv_id,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_year: inv_year,
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: inv_price,
            inv_miles: inv_miles,
            inv_color: inv_color,
            classification_id: classification_id
        })
        
    }
    const updateResult = await invModel.updateVehicle(classification_id, inv_make, inv_model, 
        inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id);
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";
    
    if(updateResult){
        
        res.status(201).render("./inventory/management-view", {
            title: title,
            nav, 
            message: `Vehicle ${inv_make} ${inv_model} has been successfully updated.`,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
            classificationSelect: dropdown,
        })
    } else {
        const message = "Sorry, the vehicle update failed."
        res.status(501).render("./inventory/management-view", {
            title: title,
            nav,
            message,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
            classificationSelect: dropdown,
        })
    }
}

/* ***************************
 *  delivers the delete vehicle view
 * ************************** */
invCont.deleteVehicleView = async function (req, res, next) {
    res.locals.detailId = parseInt(req.params.detailId);
    let nav = await utilities.getNav();
    let [data] = await invModel.getVehicleById(res.locals.detailId)
    console.log("this is the get vehicle by id data I want to know if it comes with the classification id");
    console.log(data);
    let title = "Delete " + data.inv_make + " " + data.inv_model +"?";
    // let dropdown = await utilities.getDropdown(data.classification_id);
    if(req.clientData.client_type == "Admin" || req.clientData.client_type == "Employee"){
        res.render("./inventory/delete-confirm", {
            title: title,
            nav,
            // dropdown,
            message: null,
            errors: null,
            inv_id: res.locals.detailId,
            inv_make: data.inv_make,
            inv_model: data.inv_model,
            inv_year: data.inv_year,
            inv_price: data.inv_price,
            classification_id: data.classification_id
        })
    } else if(req.clientData.client_type == "Client" || req.clientData.client_type == undefined){
        res.render("clients/login", {
            title: `Access Denied`,
            nav,
            message: "you do not have access to this area",
            errors: null,
            client_email: null,
        })
    }
}

/* ***************************
 *  Delete Vehicle 
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
    const { inv_id } = req.body;
    let [data] = await invModel.getVehicleById(inv_id)
    let dropdown = await utilities.getDropdown();
    const title = "Vehicle Deleted";
    const deleteResult = await invModel.deleteVehicle(inv_id);
    let addClassification = "../../inv/add-classification";
    let addVehicle = "../../inv/add-vehicle";
    let nav = await utilities.getNav();
    if(deleteResult){
        
        res.status(201).render("./inventory/management-view", {
            title: title,
            nav, 
            message: `Vehicle ${data.inv_make} ${data.inv_model} has been successfully deleted.`,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
            classificationSelect: dropdown,
        })
    } else {
        const message = "Sorry, the vehicle delete failed."
        res.status(501).render("./inventory/management-view", {
            title: title,
            nav,
            message,
            errors: null,
            addNewClassification: addClassification,
            addNewVehicle: addVehicle,
            classificationSelect: dropdown,
        })
    }
}


module.exports = invCont;