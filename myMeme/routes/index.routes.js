const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find()
  .populate("userInfo")
  .then(post => {
    console.log("hola desde index posts: ",post)
    let dateString = "";
    const postsModified = post.map((post1) => {
      dateString =
        post1.date.getDate() +
        "/" +
        post1.date.getMonth() +
        "/" +
        post1.date.getFullYear();
      let newObject = {
        _id: post1._id,
        userId: post1.userInfo._id,
        username: post1.userInfo.username,
        memeUrl: post1.memeUrl,
        category: post1.category,
        description: post1.description,
        date: dateString,
      };
      console.log ("newObject: ", newObject)
      return newObject;
    });
    if (req.session.currentUser) {
      const {username, _id, imageUser} = req.session.currentUser
      res.render("index", {username, _id, imageUser, post: postsModified});
      }
    else {
      res.render("index", {post: postsModified});
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
