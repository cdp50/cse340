const bcrypt = require("bcryptjs");
const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/login", {
    title: "Login",
    nav,
    message: null,
    errors: null,
  });
}

/* ****************************************
 *  Deliver error view
 **************************************** */
async function buildError(req, res, next) {
  res.render("clients/login", {});
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("clients/register", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  });
}

/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: "Sorry, there was an error processing the registration.",
      errors: null,
    });
  }

  const regResult = await accountModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  );

  if (regResult) {
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, you\'re registered ${client_firstname} ${client_lastname}. Please log in.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed.";
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginClient(req, res) {
  console.log("login client was called at the controller")
  let nav = await utilities.getNav()
  const { client_email, client_password } = req.body
  const clientData = await accountModel.getClientByEmail(client_email)
  if (!clientData) {
    console.log("there wasn't clientData at loginClient at the controller")
   //req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("clients/login", {
    title: "Login",
    nav,
    errors: null,
    client_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(client_password, clientData.client_password)) {
   delete clientData.client_password
   console.log(" ")
   console.log("clientData at process login client afterpasswords matched: ",clientData)
   const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/clients/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
 *  Process login request
 * ************************************ */
// async function loginClient(req, res) {
//   console.log("login client was called");
//   let nav = await utilities.getNav();
//   const { client_email, client_password } = req.body;
//   console.log("password from user", client_password);
//   const clientData = await accountModel.getClientByEmail(client_email);
//   console.log("password from db", clientData);
//   if (!clientData) {
//     const message = "Please check your credentials and try again.";
//     res.status(400).render("clients/login", {
//       title: "Login",
//       nav,
//       message,
//       errors: null,
//       client_email,
//     });
//     return;
//   }
//   try {
//     if (await bcrypt.compare(client_password, clientData.client_password)) {
//       delete clientData.client_password;
//       const accessToken = jwt.sign(
//         clientData,
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: 3600 * 1000 }
//       );
//       res.cookie("jwt", accessToken, { httpOnly: true });
//       return res.redirect("/clients/");
//     }
//   } catch (error) {
//     return res.status(403).send("Access Forbidden");
//   }
// }

/* ****************************************
 *  Deliver logged in view
 **************************************** */
async function buildManagement(req, res, next) {
  console.log(" ")
  console.log("build client management was called")
  console.log("req.clientData", res.clientData)
  console.log("res.locals", res.locals)
  const client_id = res.locals.clientData.client_id;
  console.log("client_id at build management: ", client_id, "res.locals.clientData: ", res.locals.clientData)
  const editAccountPath = `/clients/edit-account/${client_id}`; // it turned out that I do need the id to show the client info I just needed to add "clients" to the path
  let nav = await utilities.getNav();
  res.render("clients/loggedIn", {
    title: "Account Management",
    client_type: res.locals.clientData.client_type,
    name: res.locals.clientData.client_firstname,
    nav,
    errors: null,
    message: null,
    editAccountPath,
  });
}

/* ****************************************
 *  Logs out the client
 **************************************** */

async function logoutClient(req, res) {
  res.clearCookie("jwt");
  return res.redirect("/");
}

/* ****************************************
 *  Deliver the editInfoAccount view
 **************************************** */
async function editInfoAccount(req, res, next) {
  // cuando el path llama a esta funcion, luego tengo que volver al controller para ver que otras funciones tengo que llamar
  // I need to know how to get the client_id from the path that it's going to call this function. got it was by adding req.params
  const clientData = await accountModel.getClientById(req.params.client_id);
  let nav = await utilities.getNav();
  res.render("clients/edit-account", {
    // should I be using / before "clients"?
    title: "Edit Account",
    name: clientData.client_firstname,
    nav,
    errors: null,
    message: null,
    client_id: req.params.client_id,
    client_firstname: clientData.client_firstname,
    client_lastname: clientData.client_lastname,
    client_email: clientData.client_email,
  });
}

/* ****************************************
 *  Process edit info account request
 **************************************** */
async function accountInfoUpdate(req, res) {
  let nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_id } =
    req.body;
  const editAccountPath = `/clients/edit-account/${client_id}`;
  // if the original email and the form email are different
  // it will check if the new email is already taken
  const accBeforeUpdate = await accountModel.getClientById(client_id);
  if (accBeforeUpdate.client_email != client_email) {
    // then I can confirm that they are different, so now is safe to use checkExistingEmail()
    const emailExists = await accountModel.checkExistingEmail(client_email);
    if (emailExists) {
      res.status(501).render(`clients/edit-account`, {
        title: "Edit Account",
        name: client_firstname,
        nav,
        errors: `Email ${client_email} already exists. Please use a different email`,
        message: null,
        client_id: client_id,
        client_firstname: client_firstname,
        client_lastname: client_lastname,
        client_email: client_email,
      });
    }
  } else {
    // change the client information
    const updateResult = await accountModel.accountUpdate(
      client_firstname,
      client_lastname,
      client_email,
      client_id
    );
    const client_info = await accountModel.getClientById(client_id);
    if (updateResult) {
      res.render("clients/loggedIn", {
        title: "Account Management",
        client_type: client_info.client_type,
        name: client_firstname,
        nav,
        errors: null,
        message: `Congratulations, ${client_firstname} ${client_lastname} you\'re information is updated!`,
        editAccountPath,
      });
    } else {
      const message = "Sorry, the update failed.";
      res.status(501).render(`clients/edit-account`, {
        title: "Edit Account",
        name: client_firstname,
        nav,
        errors: null,
        message,
        client_id: client_id,
        client_firstname: client_firstname,
        client_lastname: client_lastname,
        client_email: client_email,
      });
    }
  }
}

/* ****************************************
 *  Process change of password request
 **************************************** */
async function ChangePassword(req, res) {
  let nav = await utilities.getNav();
  const { client_password, client_id } = req.body;
  const editAccountPath = `/clients/edit-account/${client_id}`;
  let hashedPassword;
  // pass regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(client_password, 10);
  // change the client password
  const passwordUpdateResult = await accountModel.ChangePassword(
    hashedPassword,
    client_id
  );
  const client_info = await accountModel.getClientById(client_id);
  if (passwordUpdateResult) {
    res.render("clients/loggedIn", {
      title: "Account Management",
      client_type: client_info.client_type,
      name: client_info.client_firstname,
      nav,
      errors: null,
      message: `Congratulations, ${client_info.client_firstname} ${client_info.client_lastname} you\'re password has been updated!`,
      editAccountPath,
    });
  } else {
    const message = "Sorry, the update failed.";
    res.status(501).render(`clients/edit-account`, {
      title: "Edit Account",
      name: client_firstname,
      nav,
      errors: null,
      message,
      client_id: client_id,
      client_firstname: null,
      client_lastname: null,
      client_email: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerClient,
  loginClient,
  buildManagement,
  logoutClient,
  buildError,
  editInfoAccount,
  accountInfoUpdate,
  ChangePassword,
};
