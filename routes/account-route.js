const express = require("express");
const router = new express.Router();
const util = require("../utilities/index");
const accController = require("../controllers/accountController");

router.get("/login/", accController.buildLogin);

router.get("/register/", accController.buildRegister);

router.post('/register', accController.registerClient)

module.exports = router; 