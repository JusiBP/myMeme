const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();

/* GET Category */
router.get("/", (req, res, next) => {
    Post.find()
    .populate("userInfo")
    .then(post => {
      console.log("hola desde index posts: ",post)
      if (req.session.currentUser) {
        const {username} = req.session.currentUser
        res.render("index", {username: username, post});
        }
      else {
        res.render("index", {post});
      }
    })
  });
  

module.exports = router;