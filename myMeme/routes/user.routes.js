const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config")
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
router.get("/createpost", fileUploader.single("memeUrl"), (req, res, next) => {
  if (req.session.currentUser) {
    const {username, _id, imageUser} = req.session.currentUser
    res.render("createPost", {username, _id, imageUser});
  }
  else {
    res.redirect("/");
  }
});

// RUTA POST --> Crear Post
router.post("/createpost", fileUploader.single("memeUrl"), (req, res, next) => {
  const {category, description} = req.body
  Post.create({ userInfo: req.params.idUser ,category, description, memeUrl: req.file.path })
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
// router.get("/profileEdit", (req, res, next) => {
//   res.render("profileEdit");
// });

// RUTA GET --> Profile Edit (TEST page)
router.get("/profileEdit", (req, res, next) => {
  User.findById(req.params.idUser)
  .then (result => {
    const user = {
      username: result.username,
      _id: result._id,
      email: result.email,
      imageUser: result.imageUser
    }
    res.render("profileEdit", user);
  })
  .catch((error) => next(error));
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

  Post.findByIdAndUpdate(
    idPost,
    { memeUrl, description, category },
    { new: true }
  )

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
      const data = { 
        username: req.session.currentUser.username,
        imageUser: req.session.currentUser.imageUser,
        _id: result._id,
        userInfo: result.userInfo,
        memeUrl: result.memeUrl,
        date: result.date,
        description: result.description,
        category: result.category
       };
      if ( data.username === data.userInfo.username){
        data.sameUser = "OK"
      }
      // console.log("hola desde SINGLEPOST:", data)
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
