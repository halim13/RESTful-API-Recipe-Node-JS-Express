const express = require("express")
const auth = require("./routes/auth")
const user = require("./routes/user")
const token = require("./routes/token")
const recipe = require("./routes/recipe")
const category = require("./routes/category")
const Route = express.Router()
Route
	.use("/api/v1/accounts", auth)
	.use("/api/v1/accounts/users/profile", user)
	.use("/api/v1/token", token)
	.use("/api/v1/recipes", recipe)
	.use("/api/v1/categories", category)
module.exports = Route
