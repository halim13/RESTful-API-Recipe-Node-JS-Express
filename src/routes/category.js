const express = require("express")
const Route = express.Router()
const Category = require("../controllers/category")

Route
	.get("/", Category.getCategories)
	.get("/food-countries", Category.getFoodCountries)
	.post("/", Category.store)

module.exports = Route
