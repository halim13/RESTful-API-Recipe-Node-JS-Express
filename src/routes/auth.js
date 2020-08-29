const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")
const jwtAuth = require("../helpers/jwt")

Route
	.get("/", jwtAuth, auth.auth)
	.post("/login", auth.login)
	.post("/register", auth.register)

module.exports = Route
