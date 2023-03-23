// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const regValidate = require('../utilities/inventory-validation');
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", 
utilities.checkClientLogin, 
utilities.handleErrors(invController.buildByClassification));

// Route to build inventory by classification view
router.get("/detail/:detailId", 
utilities.checkClientLogin, 
utilities.handleErrors(invController.buildById));

router.get("/", 
utilities.jwtAuth, 
utilities.checkClientLogin, 
utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", 
utilities.jwtAuth, 
utilities.checkClientLogin, 
utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", 
    regValidate.newClassificationRules(),
    regValidate.checkNewClaData,
    utilities.handleErrors(invController.addClassification));

router.get("/add-vehicle", 
utilities.jwtAuth, 
utilities.checkClientLogin, 
utilities.handleErrors(invController.buildAddVehicle));

router.post("/add-vehicle",
    regValidate.vehicleRegistrationRules(),
    regValidate.checkVeData,
    utilities.handleErrors(invController.addVehicle)
    );
// route to get the vehicles modification table
router.get("/getVehicles/:classification_id", 
    invController.getVehiclesJSON);

// route to get edit vehicle details
router.get("/edit/:detailId",
    utilities.jwtAuth, 
    utilities.checkClientLogin, 
    utilities.handleErrors(invController.editDetailId));
    
// route to post the updated vehicle details
router.post("/update/",
regValidate.vehicleRegistrationRules(),
regValidate.checkUpdateData,
utilities.handleErrors(invController.updateVehicle));

// route to get delete vehicle view
router.get("/delete/:detailId",
utilities.jwtAuth, 
utilities.checkClientLogin, 
utilities.handleErrors(invController.deleteVehicleView));

// route to actually delete vehicle
router.post("/delete/",
// regValidate.vehicleRegistrationRules(),
// regValidate.checkUpdateData,
utilities.handleErrors(invController.deleteVehicle));

module.exports = router;             