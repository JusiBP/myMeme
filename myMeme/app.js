// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
hbs.registerPartials("partials_absolute_path");
hbs.registerPartials(__dirname + "/views/partials");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "myMeme";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const categoryRoutes = require("./routes/category.routes");
app.use("/category", categoryRoutes);


const userRoutes = require("./routes/user.routes");
app.use("/:idUser", userRoutes);


const partialRoutes = require("./routes/partial.routes");
app.use("/", partialRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
