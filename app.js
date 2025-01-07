const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const expressLayouts = require("express-ejs-layouts");

const path = require("path");

const vehicleTypesRouter = require("./routes/vehicleTypes");
const makesRouter = require("./routes/makes");
const modelsRouter = require("./routes/models");
const carsRouter = require("./routes/cars");

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
// Default layout file
app.set("layout", "layout");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Enable method-override for PUT and DELETE requests
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
    // res.send("Hello, world!");
});
app.use("/vehicle-types", vehicleTypesRouter);
app.use("/makes", makesRouter);
app.use("/models", modelsRouter);
app.use("/cars", carsRouter);

// Catch-all route for undefined routes
app.get("*", (req, res) => {
    res.status(404).render("404"); // Render a custom 404 page
});

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`My first Express app - listening on port ${PORT}!`)
);
