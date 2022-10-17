const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// // Require the User model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// // Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
// const isLoggedOut = require("../middleware/isLoggedOut");
// const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/createpost", (req, res, next) => {
  res.render("createPost");
});

router.post("/createpost", (req, res, next) => {
  Post.create(req.body)
    .then((result) => {
      res.render("index");
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(" ----- Post created!!!! ----- ");
});

module.exports = router;
