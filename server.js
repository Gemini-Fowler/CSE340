const express = require("express")

const baseController = require("./controllers/baseController")

const app = express()

const expressLayouts = require("express-ejs-layouts")

/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

// Serve static files from the public folder
app.use(express.static('public'));

// Route to deliver the index view
app.get("/", baseController.buildHome);

/* ******************************************
 * Server host name and port
 * ***************************************** */
const HOST = 'localhost'
const PORT = 3000

/* ***********************
* Log statement to confirm server operation
* *********************** */
app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`)
})