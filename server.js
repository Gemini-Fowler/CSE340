const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
const invRoutes = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const errorHandler = require("./utilities/errorHandler");

const app = express();

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
