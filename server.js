const session = require("express-session")
const pool = require('./database/')
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser")
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
const invRoutes = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const errorHandler = require("./utilities/errorHandler");
const cookieParser = require("cookie-parser")
const app = express();

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Inside app.use section
app.use("/account", accountRoute);

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ******************************************
 * View Engine and Templates
 ****************************************** */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ******************************************
 * Static Files
 ****************************************** */
app.use(express.static("public"));

/* ******************************************
 * Routes
 ****************************************** */
app.get("/", baseController.buildHome);
app.use("/inventory", invRoutes);
app.use("/error", errorRoute);
app.use("/account", require("./routes/accountRoute"))

/* ******************************************
 * File Not Found Route (404)
 * Should come after all route definitions
 ****************************************** */
app.use(async (req, res, next) => {
  const error = { status: 404, message: "Sorry, we appear to have lost that page." };
  next(error);
});

/* ******************************************
 * Global Error Handler (Task 2)
 ****************************************** */
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

/* ******************************************
 * Server Configuration
 ****************************************** */
const HOST = "localhost";
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`);
});

"scripts"; {
  "start"; "node app.js"
}
