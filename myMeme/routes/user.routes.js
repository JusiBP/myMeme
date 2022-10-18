const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


const uploader = multer({
    dest:"./public/uploaded", //referència és arrel del projecte, no movie.routes.js
    limits: {
        fileSize: 2000000
    }
})


// RUTA GET CREAR POST
router.get("/createpost", (req, res, next) => {
  const idUser = req.params.idUser;
  console.log(req.params)
  res.render("createPost", idUser);
});

// RUTA POST CREAR POST
router.post("/createpost", uploader.single("memeUrl"), (req, res, next) => {
  console.log("hola desde crear POST")
  Post.create(req.body)
    .then((result) => {
      res.render("index");
    })
    .catch((err) => {
      console.log(err);
    });
});

// RUTA GET EDITAR POST
router.get("/:idPost/edit", (req, res, next)=>{
    Post.findById(req.params.idPost)
    .then((postToEdit) =>{
        res.render("user/post-edit", {post: postToEdit})
    })
    .catch(error => next(error));
});

// RUTA POST EDITAR POST
router.post("/:idPost/edit", (req, res, next)=>{
    const { idPost } = req.params;
    const { memeUrl, description, category } = req.body;
    
    Post.findByIdAndUpdate(idPost, { memeUrl, description, category }, { new: true })
    .then((updatedPost) =>{
        res.redirect(`:idUser/${updatedPost.id}`)
    })
    .catch(error => next(error));
});

// RUTA POST ELIMINAR POST
router.post("/:idPost/delete", (req, res, next)=>{
    const { idPost } = req.params;

    Movie.findByIdAndRemove(idPost)
    .then((postToDelete) =>{
        res.redirect("/:idUser")
    })
    .catch(error => next(error));
});

/* GET SinglePost page */
router.get("/:idPost", (req, res, next) => {
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


module.exports = router;