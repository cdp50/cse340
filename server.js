/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const baseController = require("./controllers/baseController");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities");

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));

//Index route
app.get(
  "/",
  utilities.handleErrors(baseController.buildHome)
);

// Inventory routes
app.use("/inv", require("./routes/inventory-route"));

// Account routes
app.use("/clients", require("./routes/account-route"));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Page not found" });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "The Page Crashed";
  }
  console.error(
    `Error at: "${req.originalUrl}": ${
      err.message
    } error status: ${JSON.stringify(err, null, 2)}`
  );
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

//app.get("/", baseController.buildHome)
