const express = require("express");
const Post = require("../models/Post.model");
const router = express.Router();
const dateFunction = require ("../utils/date.function.js")

router.get("/:category", (req, res, next) => {
    if (req.params.category === "All"){
        res.redirect("/");
    }
    else{
        Post.find({category: req.params.category})
        .populate("userInfo")
        .then(post => {
        let dataViews = dateFunction(post, req.session.currentUser);
        dataViews.category = req.params.category
        res.render("index", dataViews);
        })
    }
});

module.exports = router;