const express = require("express")
const Route = express.Router()
const recipe = require("../controllers/recipe")
const Recipe = require("../models/Recipe")
const User = require("../models/User")
const slug = require("../helpers/slugify")

Route
	.get("/", recipe.getRecipes)
	.get("/show/me/:userId", recipe.showMe)
	.get("/show/:categoryId", recipe.show)
	.get("/detail/:recipeId", recipe.detail)
	.get("/edit/:recipeId", recipe.edit)
	.get("/popular-views/:recipeId", recipe.popularViews)
	.get("/search-suggestions", recipe.searchSuggestions)
	.get("/favorite", recipe.favorite)
	.put("/update/favorite/:recipeId", recipe.updateFavorite)
	.put("/update/:recipeId", recipe.update)
	.post("/store", recipe.store)

module.exports = Route
