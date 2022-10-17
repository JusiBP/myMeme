const express = require('express');
const router = express.Router();

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// RUTA GET EDITAR POST
router.get("/:idPost/edit", (req, res, next)=>{

    Post.findById(req.params.idPost)
    .then((postToEdit) =>{
        res.render("user/post-edit", {post: postToEdit})
    })
    .catch(error => next(error));
})

// RUTA POST EDITAR POST
router.post("/:idPost/edit", (req, res, next)=>{
    const { idPost } = req.params;
    const { memeUrl, description, category } = req.body;
    
    Post.findByIdAndUpdate(idPost, { memeUrl, description, category }, { new: true })
    .then((updatedPost) =>{
        res.redirect(`:idUser/${updatedPost.id}`)
    })
    .catch(error => next(error));
})

// RUTA POST ELIMINAR POST
router.post("/:idPost/delete", (req, res, next)=>{
    
    Movie.findByIdAndRemove(req.params.id)
    .then((postToDelete) =>{
        res.redirect("/:idUser")
    })
    .catch(err =>{
        console.log(err)
    })
})



module.exports = router;