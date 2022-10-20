const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const multer = require("multer");
const dateFunction = require ("../utils/date.function.js")

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



// RUTA GET --> User Profile
router.get("/", (req, res, next) => {
    const idUser = req.params.idUser;
    Post.find({userInfo: idUser})
    .populate ("userInfo")
    .then(post => {
      let dataViews = dateFunction(post, req.session.currentUser);
      res.render("index", dataViews);
    })
    .catch((error) => next(error));
  });

// RUTA GET --> Crear Post
router.get("/createpost", (req, res, next) => {
  if (req.session.currentUser) {
    const {username, _id, imageUser} = req.session.currentUser
    res.render("createPost", {username, _id, imageUser});
  }
  else {
    res.redirect("/");
  }
});

// RUTA POST --> Crear Post
router.post("/createpost", uploader.single("memeUrl"), (req, res, next) => {
  const {category, description} = req.body
  Post.create({ userInfo: req.params.idUser ,category, description, memeUrl: "/uploaded/" + req.file.filename })
    .then((post) => {
      const data = {
        post: post,
      };
      if (req.session.currentUser) {
        console.log("EN RUTA CREAR POST: ", post)
        // res.render("singlePost", {username, _id, imageUser, data});
        res.redirect(`/${post.userInfo}/${post._id}`)
      }
      else {
        res.redirect("/");
      }
    })
    .catch((error) => next(error));
});

// RUTA GET --> Profile Edit (TEST page)
router.get("/profileEdit", (req, res, next) => {
    res.render("profileEdit");
  });

// // RUTA GET EDITAR POST
// router.get("/:idPost/postEdit", (req, res, next) => {
//   Post.findById(req.params.idPost)
//     .then((postToEdit) => {
//       res.render("user/post-edit", { post: postToEdit });
//     })
//     .catch((error) => next(error));
// });

// // RUTA POST EDITAR POST
// router.post("/:idPost/postEdit", (req, res, next) => {
//   const { idPost } = req.params;
//   const { memeUrl, description, category } = req.body;
//   const { idUser } = req.params;

//   Post.findByIdAndUpdate(idPost,{ memeUrl, description, category },{ new: true })

//     .then((updatedPost) => {
//       res.redirect(`/${idUser}/${updatedPost.id}`);
//     })
//     .catch((error) => next(error));
// });

// RUTA GET EDITAR POST
router.get("/:idPost/postEdit", (req, res, next) => {
  const { idUser } = req.params;
  const { idPost } = req.params;
  Post.findById(req.params.idPost)
    .then((postToEdit) => {
      res.render("user/post-edit", { idUser, idPost, post: postToEdit });
    })
    .catch((error) => next(error));
});
// RUTA POST EDITAR POST
router.post("/:idPost/postEdit", (req, res, next) => {
  const { idUser } = req.params;
  const { idPost } = req.params;
  const { memeUrl, description, category } = req.body;
  console.log("hola desde UPDATE POST: ", req.body)
  
  Post.findByIdAndUpdate(idPost,{ memeUrl, description, category },{ new: true })
    .then((updatedPost) => {
      console.log("hola desde UPDATE POST: ", updatedPost)
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
      console.log("hola desde SINGLEPOST:", result)
      const data = { post: result };
      res.render("singlePost", data);
    })
    .catch((err) => {
      console.log("error: ", err);
    });
});

module.exports = router;
