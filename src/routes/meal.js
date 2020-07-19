const express = require("express")
const Route = express.Router()
const Meal = require("../controllers/meal")
Route.get("/", Meal.all).get("/show/:id", Meal.show).get("/detail/:id", Meal.detail).get("/popular-views/:id", Meal.popularViews).get("/search-suggestions", Meal.searchSuggestions).get("/favourite", Meal.favourite).put("/update/favourite/:id", Meal.updateFavourite)
module.exports = Route
