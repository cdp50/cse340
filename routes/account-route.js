const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation');
const accController = require("../controllers/accountController");

router.get("/login/", utilities.checkClientLogin, utilities.handleErrors(accController.buildLogin));

router.get("/error/", utilities.handleErrors(accController.buildError));

router.get("/register/", utilities.checkClientLogin, utilities.handleErrors(accController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerClient)
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.loginClient)
  )

// Middleware to check token validity, then, logs the client in
router.get("/", utilities.checkJWTToken, utilities.jwtAuth, utilities.checkClientLogin, utilities.handleErrors(accController.buildManagement))

// process the delete of cookies
router.get("/logout", utilities.handleErrors(accController.logoutClient))



module.exports = router; 