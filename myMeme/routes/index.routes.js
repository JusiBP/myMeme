const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET SinglePost test page */
router.get("/singlePostTest", (req, res, next) => {
  res.render("singlePost");
});

// /* GET login page */
// router.get("/login", (req, res, next) => {
//   res.render("auth/login");
// });

// /* GET Sign in page */
// router.get("/signin", (req, res, next) => {
//   res.render("auth/signin");
// });

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
