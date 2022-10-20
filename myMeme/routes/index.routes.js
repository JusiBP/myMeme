const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();
const dateFunction = require ("../utils/date.function.js")

// RUTA GET --> Home Page
router.get("/", (req, res, next) => {
  Post.find()
  .populate("userInfo")
  .then(post => {
      // post.sort(function(a, b){
      //   return (a.date - b.date)
      // })
      let dataViews = dateFunction(post, req.session.currentUser);
      res.render("index", dataViews);
  })
  .catch((error) => next(error));
});

router.get("/aboutUs", (req, res, next)=>{
  res.render("aboutUs");
})

module.exports = router;