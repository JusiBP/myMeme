const express = require('express');
const router = express.Router();
const Post = require("../models/Post.model.js");
const User = require("../models/User.model.js");

/* GET SinglePost page */
router.get("/:idPost", (req, res, next) => {
    res.render("/singlePost");
  });

/* GET SinglePost page */
router.get("/:idUser/:idPost", (req, res, next) => {
    Post.findById(req.params.idPost)
    .populate("username")
    .then (result => {
        const data = {post: result}
        res.render("singlePost", data);
    })
    .catch(err => {
        console.log("error: ", err);
    }) 
  });


