const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find()
  .then(post => {
    const {_id, username, memeUrl, category, description} = post;
    console.log("hola desde index posts: ",post)
    if (req.session.currentUser) {
      const {username} = req.session.currentUser
      res.render("index", {username: username, post});
      }
    else {
      res.render("index", post);
    }
  })
});

/* GET SinglePost TEST page */
router.get("/singlePostTest", (req, res, next) => {
  res.render("singlePost");
});

/* GET profileEdit TEST page */
router.get("/profileEdit", (req, res, next) => {
  res.render("profileEdit");
  // Post.findById(req.params.idPost)
  // .populate("username")
  // .then (result => {
  //     const data = {post: result}
  //     res.render("singlePost", data);
  // })
  // .catch(err => {
  //     console.log("error: ", err);
  // })
});

module.exports = router;
