// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to build inventory by classification view
router.get("/detail/:detailId", invController.buildById);
// invController.buildById

module.exports = router;             