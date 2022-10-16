const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET login page */
router.get("/login", (req, res, next) => {
  res.render("login");
});

/* GET Sign in page */
router.get("/signin", (req, res, next) => {
  res.render("signin");
});

module.exports = router;
