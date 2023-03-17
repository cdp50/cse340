// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const regValidate = require('../utilities/inventory-validation');
const utilities = require("../utilities");



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.checkClientLogin, utilities.handleErrors(invController.buildByClassification));

// Route to build inventory by classification view
router.get("/detail/:detailId", utilities.checkClientLogin, utilities.handleErrors(invController.buildById));

router.get("/", utilities.jwtAuth, utilities.checkClientLogin, utilities.handleErrors(invController.buildManagement));//aqui tiene que haber un control

router.get("/add-classification", utilities.jwtAuth, utilities.checkClientLogin, utilities.handleErrors(invController.buildAddClassification));//aqui tiene que haber un control

router.post(
    "/add-classification", 
    regValidate.newClassificationRules(),
    regValidate.checkNewClaData,
    utilities.handleErrors(invController.addClassification));

router.get("/add-vehicle", utilities.jwtAuth, utilities.checkClientLogin, utilities.handleErrors(invController.buildAddVehicle));//aqui tiene que haber un control

router.post(
    "/add-vehicle",
    regValidate.vehicleRegistrationRules(),
    regValidate.checkVeData,
    utilities.handleErrors(invController.addVehicle)
    );

module.exports = router;             