// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const regValidate = require('../utilities/inventory-validation');
const utilities = require("../utilities");



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.checkClientLogin, invController.buildByClassification);

// Route to build inventory by classification view
router.get("/detail/:detailId", utilities.checkClientLogin, invController.buildById);

router.get("/", utilities.jwtAuth, utilities.checkClientLogin, invController.buildManagement);//aqui tiene que haber un control

router.get("/add-classification", utilities.jwtAuth, utilities.checkClientLogin, invController.buildAddClassification);//aqui tiene que haber un control

router.post(
    "/add-classification", 
    regValidate.newClassificationRules(),
    regValidate.checkNewClaData,
    invController.addClassification);

router.get("/add-vehicle", utilities.jwtAuth, utilities.checkClientLogin, invController.buildAddVehicle);//aqui tiene que haber un control

router.post(
    "/add-vehicle",
    regValidate.vehicleRegistrationRules(),
    regValidate.checkVeData,
    invController.addVehicle
    );

module.exports = router;             