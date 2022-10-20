const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();

/* GET Category */
router.get("/:category", (req, res, next) => {
    console.log ("EN RUTA! params:", req.params )
    if (req.params.category === "All"){
        res.redirect("/");
    }
    else{
        Post.find({category: req.params.category})
        .then(post => {
            console.log("hola desde category posts: ",post)
            //   post.category = "WTF"
            if (req.session.currentUser) {
            const {username} = req.session.currentUser
            res.render("index", {username: username, post});
            }
            else {
            res.render("index", {post});
        }
        })
    }
});
  

module.exports = router;