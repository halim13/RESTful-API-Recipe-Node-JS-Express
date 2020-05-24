const express = require('express');
const Route = express.Router();
const recipe = require('../controllers/recipe');
const Recipe = require('../models/Recipe');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./public/images/recipe");
  },
  filename: async (request, file, callback) =>  {
    callback(null, `${file.fieldname.toLowerCase()}`);
  }
});
const upload = multer({
  storage
}).single("imageurl");
Route
  .post('/store', upload, recipe.store),
module.exports = Route;
