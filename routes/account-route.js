const express = require("express");
const router = new express.Router();
const util = require("../utilities/index");
const regValidate = require('../utilities/account-validation');
const accController = require("../controllers/accountController");

router.get("/login/", accController.buildLogin);

router.get("/register/", accController.buildRegister);

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    accController.registerClient
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
  )

  // (req, res) => {
  //   res.status(200).send('login process')
  // }

module.exports = router; 