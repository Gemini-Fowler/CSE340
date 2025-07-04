/* ***************************************
 * This is the application server
 * ***************************************/
const express = require("express")

const app = express()

const expressLayouts = require("express-ejs-layouts")

/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ******************************************
 * Default GET route
 * ***************************************** */
app.get("/", (req, res) => { res.send("Welcome home!") })

// Route to deliver the index view
app.get("/", function(req, res){
  res.render("index", {title: "Home"});
});


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