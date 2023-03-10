const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation');
const accController = require("../controllers/accountController");

router.get("/login/", utilities.checkClientLogin, accController.buildLogin);

router.get("/register/", utilities.checkClientLogin, accController.buildRegister);

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
    accController.loginClient
  )

// Middleware to check token validity, then, logs the client in
router.get("/", utilities.checkJWTToken, utilities.checkClientLogin, utilities.jwtAuth, accController.buildManagement)

// process the delete of cookies
router.get("/logout", accController.logoutClient)



module.exports = router; 