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

router.get("/", utilities.checkClientLogin, invController.buildManagement);

router.get("/add-classification", utilities.checkClientLogin, invController.buildAddClassification);

router.post(
    "/add-classification", 
    regValidate.newClassificationRules(),
    regValidate.checkNewClaData,
    invController.addClassification);

router.get("/add-vehicle", utilities.checkClientLogin, invController.buildAddVehicle);

router.post(
    "/add-vehicle",
    regValidate.vehicleRegistrationRules(),
    regValidate.checkVeData,
    invController.addVehicle
    );

module.exports = router;             