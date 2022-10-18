const express = require("express");
const router = express.Router();

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
