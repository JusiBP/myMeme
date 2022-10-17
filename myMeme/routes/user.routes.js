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

  router.get("/:idMovie", (req, res, next) => {  //GET movie por id y renderizar vista movie-details con los datos de la pelicula seleccionada.
    Movie.findById(req.params.idMovie)
    .populate("cast") //Puesto que cast es una id que conecta con el model celebrity, populate nos hace un incrustado de los datos para que podamos disponer de ellos. OJO, en este caso devuelve un array, de ahí el forEach en el hbs.
    .then (result => {
        const data = {movie: result}
        res.render("movies.views/movie-details", data); //renderizado de la view movie-details (pasamos data de la movie para rellenar la pagina)
    })
    .catch(err => {
        console.log("error: ", err);
    }) 
  });