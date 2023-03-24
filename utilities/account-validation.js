const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  this will return only the rules
 *  checkRegData will use this rules. 
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("client_firstname")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("client_lastname")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("client_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (client_email) => {
          const emailExists = await accountModel.checkExistingEmail(client_email)
          if (emailExists){
            throw new Error("Email already exists. Please login or use different email")
          }
        }),
      
      // password is required and must be strong password
      body("client_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/*  **********************************
*  Check data against rules and return errors or next()
* ********************************* */
validate.checkRegData = async (req, res, next) => {
    const { client_firstname, client_lastname, client_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render ("../views/clients/register", {
        errors,
        message: null, 
        title: "Registration", 
        nav, 
        client_firstname, 
        client_lastname, 
        client_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  this will return only the rules
 *  checkLoginData will use this rules. 
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email)
        if (!emailExists){
          throw new Error("Email not registered. Please register using the link below")
        }
      }),
    
    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ]
}

/*  **********************************
*  Check data against rules and return errors or next()
* ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { client_email } = req.body
  let errors = []
  errors = validationResult (req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render ("../views/clients/login", {
      errors,
      message: null, 
      title: "Login", 
      nav, 
      client_email,
      })
      return
  }
  next()
}

/*  **********************************
 *  this will return only the rules
 *  checkInfoUpdateData will use 
 *  this rules. 
 * ********************************* */
validate.infoUpdateRules = () => {
  console.log("infoUpdateRules was called at account validation")
  // const client_id  =  body("client_id")
  // console.log("client_id")
  
  // console.log(client_id)
  return [
  // body("client_id").custom(async (client_id) => {var client_id = client_id; console.log(client_id)}),  
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and can already exist in the database in case he doesn't change it.
    body("client_email")
      .trim() 
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")  // this code is not working but why?!
      // if the original email is different form the one giving me now
      // it will check if the new email is already taken
      // .custom(async (client_email) => {

      //   const accBeforeUpdate = await accountModel.getClientById(client_id);
      //   if(accBeforeUpdate.client_email != client_email){
      //     const emailExists = await accountModel.checkExistingEmail(client_email)
      //     if (emailExists){ "and this email that exist can't be the same"
      //       throw new Error("Email already exists. Please use a different email")
      //     }
      //   }
      // })
  ]
}

/*  **********************************
*  Check data against rules and return errors or next()
* ********************************* */
validate.checkInfoUpdateData = async (req, res, next) => {
  console.log("checkInfoUpdateData was called at account validation")
  const { client_firstname, client_lastname, client_email, client_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render(`../views/clients/edit-account/${client_id}`, {
      errors,
      message: null, 
      title: "Edit Account", 
      nav, 
      client_firstname, 
      client_lastname, 
      client_email,
      })
      return
  }
  next()
}

/*  **********************************
 *  this will return only the rules
 *  checkPasswordUpdateData will use 
 *  this rules. 
 * ********************************* */
validate.PasswordUpdateRules = () => {
  return [
    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements")
  ]
}

/*  **********************************
*  Check data against rules and return errors or next()
* ********************************* */
validate.checkPasswordUpdateData = async (req, res, next) => {
  const { client_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render (`../views/clients/edit-account/${client_id}`, {
      errors,
      message: null, 
      title: "Login", 
      nav, 
      client_firstname: null, 
      client_lastname: null, 
      client_email: null,
      })
      return
  }
  next()
}


module.exports = validate;
