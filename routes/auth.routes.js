const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
//require('dotenv').config(); this is for haroku

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
// Require cloudinary and multer
const fileUploader = require("../config/cloudinary.config");
const multer = require("multer");
const uploader = multer({
  dest: "./public/uploaded",
  limits: {
    fileSize: 2000000,
  },
});
// GET /auth/signin
router.get("/signin", isLoggedOut, (req, res) => {
  res.render("auth/signin");
});

// POST /auth/signin
router.post(
  "/signin",
  isLoggedOut,
  fileUploader.single("imageUser"),
  (req, res, next) => {
    const { username, email, password } = req.body;

    // Check that username, email, and password are provided
    if (username === "" || email === "" || password === "") {
      res.status(400).render("auth/signin", {
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });

      return;
    }

    if (password.length < 6) {
      res.status(400).render("auth/signin", {
        errorMessage: "Your password needs to be at least 6 characters long.",
      });

      return;
    }

    //   ! This regular expression checks password for special characters and minimum length
    /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

    // Create a new user - start by hashing the password
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        let newUser = { username, email, password: hashedPassword };
        if (req.file) newUser.imageUser = req.file.path;
        return User.create(newUser);
      })
      .then((user) => {
        req.session.currentUser = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render("auth/signin", { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render("auth/signin", {
            errorMessage:
              "Username and email need to be unique. Provide a valid username or email.",
          });
        } else {
          next(error);
        }
      });
  }
);

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
