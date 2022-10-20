const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const multer = require("multer");
const fileUploader = require("../config/cloudinary.config");
const uploader = multer({
  dest: "./public/uploaded", //referència és arrel del projecte, no movie.routes.js
  limits: {
    fileSize: 2000000,
  },
});

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// RUTA GET UserProfile
router.get("/", (req, res, next) => {
  const idUser = req.params.idUser;
  Post.find({ userInfo: idUser })
    .populate("userInfo")
    .then((postsUser) => {
      console.log("Hola desde UserProfile: ", postsUser);
      if (req.session.currentUser) {
        const { username } = req.session.currentUser;
        res.render("profile", { username: username, postsUser });
      } else {
        res.render("profile", { postsUser });
      }
    })
    .catch((error) => next(error));
});

// RUTA GET CREAR POST
router.get("/createpost", (req, res, next) => {
  const idUser = req.params.idUser;
  res.render("createPost", { idUser });
});

// RUTA POST CREAR POST
router.post("/createpost", fileUploader.single("memeUrl"), (req, res, next) => {
  console.log("hola desde crear POST: ", req.body);
  const { category, description } = req.body;
  Post.create({
    userInfo: req.params.idUser,
    category,
    description,
    memeUrl: req.file.path,
  })
    .then((post) => {
      const data = {
        post: post,
      };
      res.render("singlePost", data);
    })
    .catch((error) => next(error));
});

// /* GET profileEdit TEST page */
router.get("/profileEdit", (req, res, next) => {
  res.render("profileEdit");
});

// RUTA GET EDITAR POST
router.get("/:idPost/postEdit", (req, res, next) => {
  Post.findById(req.params.idPost)
    .then((postToEdit) => {
      res.render("user/post-edit", { post: postToEdit });
    })
    .catch((error) => next(error));
});

// RUTA POST EDITAR POST
router.post("/:idPost/postEdit", (req, res, next) => {
  const { idPost } = req.params;
  const { memeUrl, description, category } = req.body;
  const { idUser } = req.params;

  Post.findByIdAndUpdate(
    idPost,
    { memeUrl, description, category },
    { new: true }
  )

    .then((updatedPost) => {
      res.redirect(`/${idUser}/${updatedPost.id}`);
    })
    .catch((error) => next(error));
});

// RUTA POST ELIMINAR POST
router.post("/:idPost/delete", (req, res, next) => {
  const { idPost } = req.params;

  Movie.findByIdAndRemove(idPost)
    .then((postToDelete) => {
      res.redirect("/:idUser");
    })
    .catch((error) => next(error));
});

/* GET SinglePost page */
router.get("/:idPost", (req, res, next) => {
  Post.findById(req.params.idPost)
    .populate("userInfo")
    .then((result) => {
      console.log("hola desde SINGLEPOST:", result);
      const data = { post: result };
      res.render("singlePost", data);
    })
    .catch((err) => {
      console.log("error: ", err);
    });
});
router.get("/", (req, res, next) => {
  res.render("userProfile");
});

module.exports = router;
