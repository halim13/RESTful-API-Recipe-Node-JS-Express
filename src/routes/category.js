const express = require("express")
const Route = express.Router()
const Category = require("../controllers/category")
Route.get("/", Category.all).post("/", Category.store)
module.exports = Route
