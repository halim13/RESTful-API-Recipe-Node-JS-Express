const express = require("express")
const Route = express.Router()
const user = require("../controllers/user")
const jwtAuth = require("../helpers/jwt")

Route
	.get("/:userId", user.getCurrentProfile)
	.get("/view/:userId", user.viewProfile)
	.put("/update/:userId", user.updateProfile)

module.exports = Route
