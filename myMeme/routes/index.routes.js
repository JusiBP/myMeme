const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
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
