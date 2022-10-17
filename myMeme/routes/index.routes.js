const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("Hello Index");
  res.render("index");
});

/* GET login page */
router.get("/login", (req, res, next) => {
  console.log("Hello login");
  res.render("auth/login");
});

/* GET Sign in page */
router.get("/signin", (req, res, next) => {
  console.log("Hello signin");
  res.render("auth/signin");
});

module.exports = router;
