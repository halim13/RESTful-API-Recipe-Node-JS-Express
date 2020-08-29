const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")

Route
	.post("/refresh-token", auth.refreshToken)

module.exports = Route
