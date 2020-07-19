const express = require("express")
const Route = express.Router()
const recipe = require("../controllers/recipe")
const Recipe = require("../models/Recipe")
const User = require("../models/User")
const slug = require("../helpers/slugify")
Route.get("/edit/:id", recipe.edit).put("/update/:mealId", recipe.update).post("/store", recipe.store)
module.exports = Route
