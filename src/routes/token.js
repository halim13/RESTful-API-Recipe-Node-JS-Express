const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")
const jwtAuth = require("../helpers/jwt")
Route.post("/refresh-token", auth.refreshToken)
module.exports = Route
