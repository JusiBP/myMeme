const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");
const multer = require("multer");
const dateFunction = require("../utils/date.function.js");

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
  Post.find({ userInfo: idUser })
    .populate("userInfo")
    .then((post) => {
      let dataViews = dateFunction(post, req.session.currentUser);
      res.render("index", dataViews);
    })
    .catch((error) => next(error));
});

// RUTA GET --> Crear Post
router.get("/createpost", fileUploader.single("memeUrl"), (req, res, next) => {
  if (req.session.currentUser) {
    const { username, _id, imageUser } = req.session.currentUser;
    res.render("createPost", { username, _id, imageUser });
  } else {
    res.redirect("/");
  }
});

// RUTA POST --> Crear Post
router.post("/createpost", fileUploader.single("memeUrl"), (req, res, next) => {
  //console.log("hola desde crear POST: ", req.body);
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
      if (req.session.currentUser) {
        res.redirect(`/${post.userInfo}/${post._id}`);
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => next(error));
});

// RUTA GET --> Profile Edit
router.get("/profileEdit", (req, res, next) => {
  User.findById(req.params.idUser)
    .then((result) => {
      const user = {
        username: result.username,
        _id: result._id,
        email: result.email,
        imageUser: result.imageUser,
      };
      res.render("profileEdit", user);
    })
    .catch((error) => next(error));
});

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

// RUTA GET --> Editar Post
router.get("/:idPost/postEdit", (req, res, next) => {
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
        category: result.category,
      };
      res.render("user/post-edit", data);
    })
    .catch((error) => next(error));
});
// RUTA POST EDITAR POST
router.post("/:idPost/postEdit", (req, res, next) => {
  console.log("hola desde UPDATE POST");
  const { idUser } = req.params;
  const { idPost } = req.params;
  const { memeUrl, description, category } = req.body;

  Post.findByIdAndUpdate(
    idPost,
    { memeUrl, description, category },
    { new: true }
  )
    .then((updatedPost) => {
      console.log("hola desde UPDATE POST: ", updatedPost);
      res.redirect(`/${idUser}/${updatedPost._id}`);
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
      let alreadyLiked = false;
      result.likes.forEach((userLike) => {
        if (userLike == req.session.currentUser._id) alreadyLiked = true;
      });
      const data = {
        username: req.session.currentUser.username,
        imageUser: req.session.currentUser.imageUser,
        _id: result._id,
        userInfo: result.userInfo,
        memeUrl: result.memeUrl,
        date: result.date,
        description: result.description,
        category: result.category,
        likesCount: result.likes.length,
        alreadyLiked: alreadyLiked,
      };

      if (data.username === data.userInfo.username) {
        data.sameUser = "OK";
      }
      // console.log("hola desde SINGLEPOST:", data)
      res.render("singlePost", data);
    })
    .catch((err) => {
      console.log("error: ", err);
    });
});

router.post("/:idPost", (req, res, next) => {
  // User.findById(req.session.currentUser._id).then((result) => {
  //   let alreadyLikedUser = false;
  //   result.likedPosts.forEach((likedPost) => {
  //     result.likedPosts.forEach((likedPost2) => {
  //       if (likedPost == likedPost2) alreadyLikedUser = true;
  //     });
  //   });
  //   if (alreadyLikedUser) {
  //     result.likedPosts.remove(req.params.idPost);
  //     console.log("WAS ALREADY LIKED");
  //   } else {
  //     result.likedPosts.push(req.params.idPost);
  //     console.log(
  //       "Was not liked ----- WRITE THIS ID POST IN DB",
  //       req.params.idPost
  //     );
  //   }

  //   result.save();
  // });

  Post.findById(req.params.idPost).then((result) => {
    console.log("CURRENT USER HERE :    --- >> ", req.session.currentUser._id);

    console.log(
      "CURRENT IDPOST HERE: ------------------->>>>>",
      req.params.idPost
    );
    console.log("RESULT.LIKES ARRAY BEFORE CHANGES: ", result.likes);
    let alreadyLiked = false;

    result.likes.forEach((userLike) => {
      if (userLike == req.session.currentUser._id) alreadyLiked = true;
    });
    if (alreadyLiked) result.likes.remove(req.session.currentUser._id);
    else {
      result.likes.push(req.session.currentUser._id);
    }
    console.log("RESULT AFTer cHanges, before save to DB : ", result.likes);
    result.save();
  });
  res.redirect(`/${req.params.idUser}/${req.params.idPost}`);
});

router.get("/", (req, res, next) => {
  res.render("userProfile");
});

module.exports = router;
