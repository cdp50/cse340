// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to build inventory by classification view
router.get("/detail/:detailId", invController.buildById);

router.get("/", invController.buildManagement);

router.get("/add-classification", invController.buildAddClassification);

router.post("/add-classification", invController.addClassification);

router.get("/add-vehicle", invController.buildAddVehicle);

router.post("/add-vehicle", invController.addVehicle);

module.exports = router;             