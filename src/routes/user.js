const express = require("express")
const Route = express.Router()
const user = require("../controllers/user")
const User = require("../models/User")
const jwtAuth = require("../helpers/jwt")
const slug = require("../helpers/slugify")
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./public/images/avatar")
  },
  filename: async (request, file, callback) => {
    const userId = request.params.userId
    const username = await User.auth(userId)
    callback(null, `${file.fieldname.toLowerCase()}-${slug.string_to_slug(username[0].name.toLowerCase())}.jpg`)
  }
})
const upload = multer({
  storage
}).single("avatar")
Route.get("/:userId", user.getProfile).put("/update/:userId", user.updateProfile)
module.exports = Route
