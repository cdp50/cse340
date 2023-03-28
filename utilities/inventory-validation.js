const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules.
 *  this will return only the rules
 *  checkVeData will use this rules 
 *  to check if there are errors
 *  if there are it will return them. 
 * ********************************* */
validate.vehicleRegistrationRules = () => {
    return [
      // classification is required
      body("classification_id")
        .trim()
        .escape()
        .isInt()
        .withMessage("Please provide the classification of the vehicle."), // on error this message is sent.

      // make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .isLength({ min: 3 })
        .isAlpha()
        .withMessage("Please provide the make of the vehicle."), // on error this message is sent.
  
      // model is required and must be string integer or both
      body("inv_model")
        .trim()
        .escape()
        .isLength({ min: 2 })
        .withMessage("Please provide the model of the vehicle."), // on error this message is sent.
  
      // year is required and must be a 4 digits integer 
      body("inv_year")
        .trim()
        .escape()
        .isInt()
        .withMessage("Year has to be numbers only")
        .isLength({ min: 4 })
        .withMessage("Year has to be 4 digits e.g. 2022")
        .isLength({ max: 4 })
        .withMessage("Year has to be 4 digits e.g. 2022")
        .withMessage("Please provide the year of the vehicle."), // on error this message is sent.

      // description is required and can contain string, integer, and symbols.
      body("inv_description")
        .trim()
        .isLength({ max: 206 })
        .withMessage("The description can't be longer than 4 lines.")
        .isLength({ min: 20 })
        .withMessage("Please provide the description of the vehicle."), // on error this message is sent.

        // image is required and can contain string, integer, and symbols.
      body("inv_image")// it should check if the word image is in, and if there are "/ in it"
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the image of the vehicle."), // on error this message is sent.

      // thumbnail is required and can contain string, integer, and symbols.
      body("inv_thumbnail") // it should check if the word image is in, and if there are "/ in it"
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the thumbnail of the vehicle."), // on error this message is sent.

        // price is required and must be 1-7 digits.
        body("inv_price")
        .trim()
        .escape()
        .isDecimal()
        .isLength({ min: 1 })
        .isLength({ max: 10 })
        .withMessage("Price must be 1 to 10 digits."), // on error this message is sent.

        // miles is required and must be a 1-6 digits integer.
        body("inv_miles")
        .trim()
        .escape()
        .isInt()
        .withMessage("Miles has to be numbers only")
        .isLength({ min: 1 })
        .withMessage("Miles has to be at least 1 digits e.g. 6784")
        .isLength({ max: 6 })
        .withMessage("Miles has to be at most 6 digits e.g. 234567")
        .withMessage("Please provide the miles of the vehicle."), // on error this message is sent.

        // color is required and must be string
      body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide the color of the vehicle."), // on error this message is sent.
    ]
  }


/*  **********************************
*  Check data and return errors or continue to registration
* ********************************* */
validate.checkVeData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let validationErrors = []
    validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        let nav = await utilities.getNav()
        let dropdown = await utilities.getDropdown(classification_id)
        res.render ("../views/inventory/add-vehicle", {
        validationErrors,
        errors:null,
        message: null, 
        title: "Add new vehicle", 
        nav, 
        dropdown,
        classification_id,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color,
        })
        return
    }
    next()
}

/*  **********************************
 *  Registration Data Validation Rules.
 *  this will return only the rules
 *  checkNewClaData will use this rules 
 *  to check if there are validationErrors
 *  if there are it will return them. 
 * ********************************* */
validate.newClassificationRules = () => {
    return [
      // make is required and must be string
      body("classificationName")
        .trim()
        .escape()
        .isLength({ min: 3 })
        .isAlpha()
        .withMessage("Please provide the name of the classification."), // on error this message is sent.
    ]
}

/*  **********************************
*  Check data and return validationErrors or continue to registration
* ********************************* */
validate.checkNewClaData = async (req, res, next) => {
    const { classificationName } = req.body
    let validationErrors = []
    validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render ("../views/inventory/add-classification", {
        validationErrors,
        errors:null,
        message: null, 
        title: "Add new Classification", 
        nav, 
        classificationName,
        })
        return
    }
    next()
}

/*  **********************************
*  Check data and return errors or continue to edit vehicle
* ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body;
  let title = "Edit " + inv_make + " " + inv_model;
  let validationErrors = []
  validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropdown = await utilities.getDropdown(classification_id)
      res.render ("../views/inventory/edit-vehicle", {
      validationErrors,
      errors:null,
      message: null, 
      title, 
      nav, 
      dropdown,
      classification_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      inv_id,
      })
      return
  }
  next()
}


module.exports = validate;
