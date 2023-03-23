const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation');
const accController = require("../controllers/accountController");

router.get("/login/", 
    utilities.checkClientLogin, 
    utilities.handleErrors(accController.buildLogin));

router.get("/error/", 
    utilities.handleErrors(accController.buildError));

router.get("/register/", 
    utilities.checkClientLogin, 
    utilities.handleErrors(accController.buildRegister));

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
router.get("/", 
    utilities.checkJWTToken, 
    utilities.jwtAuth, 
    utilities.checkClientLogin, 
    utilities.handleErrors(accController.buildManagement))

// process the delete of cookies
router.get("/logout", 
    utilities.handleErrors(accController.logoutClient))

// shows the edit-account view
router.get("/edit-account/:client_id", // I took this part out of the path /:client_id this part was for the links inside the view I want to reach
    utilities.checkClientLogin, 
    utilities.handleErrors(accController.editInfoAccount));// I'm not getting the view and I know that checkclientlogin is not the problem
    
// process the information update done at edit-account
router.post("/account-update", 
    utilities.checkClientLogin, // I have to check that the client is logged in 
    regValidate.infoUpdateRules(), // I have to have rules for the account-update
    regValidate.checkInfoUpdateData, // I have to check that the update meets the requirement rules
    utilities.handleErrors(accController.accountInfoUpdate));

// process the password update done at edit-account
router.post("/change-password", 
    utilities.checkClientLogin, // I have to check that the client is logged in 
    regValidate.PasswordUpdateRules(), // I have to have rules for the account-update
    regValidate.checkPasswordUpdateData, // I have to check that the update meets the requirement rules
    utilities.handleErrors(accController.ChangePassword));
    
    
    
    
    module.exports = router; 
