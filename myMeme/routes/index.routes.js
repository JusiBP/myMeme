const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find().then((posts) => {
    let dateString = "";
    //const { _id, username, memeUrl, category, description, date } = post;
    // console.log("hola desde index posts: ", post);
    const postsModified = posts.map((post1) => {
      dateString =
        post1.date.getDate() +
        "/" +
        post1.date.getMonth() +
        "/" +
        post1.date.getFullYear();

      let newObject = {
        memeUrl: post1.memeUrl,
        description: post1.description,
        date: dateString,
      };
      newObject.dateString = dateString;
      console.log("IN MAP : ", post1);
      console.log("New object DAteSTRING:", newObject.dateString);
      return newObject;
    });

    if (req.session.currentUser) {
      const { username } = req.session.currentUser;

      //console.log(" PostModified[]0: ", postsModified[0]);
      res.render("index", { username: username, post: postsModified });
      //console.log("OBJECT : ", { username: username, posts });
    } else {
      res.render("index", { post: postsModified });
    }
  });
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
