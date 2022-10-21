const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config")
const multer = require("multer");
const uploader = multer({
    dest: "./public/uploaded", //referència és arrel del projecte, no movie.routes.js
    limits: {
      fileSize: 2000000,
    },
  });

router.get("/header", (req, res, next) => {
  res.render("partials/header");
});

router.get("/footer", (req, res, next) => {
  res.render("partials/footer");
});

router.get("/headerLoggedUser", (req, res, next) => {
  res.render("partials/headerLoggedUser");
});

module.exports = router;
