const resolve = require("path").resolve
const misc = require("../helpers/response")
const slug = require("../helpers/slugify")
const fs = require("fs-extra")
const User = require("../models/User")

module.exports = {

  getCurrentProfile: async (request, response) => {
    const userId = request.params.userId
    try {
      const getCurrentProfile = await User.getCurrentProfile(userId)
      misc.response(response, 200, false, null, getCurrentProfile)
    } catch (error) {
      console.log(error.messsage) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  viewProfile: async (request, response) => {
    const userId = request.params.userId
    try {
      const viewProfile = await User.viewProfile(userId)
      misc.response(response, 200, false, null, viewProfile)
    } catch(error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  updateProfile: async (request, response) => {
    const path = "/public/images/avatar/"
    const userId = request.params.userId
    const userDb = await User.getCurrentProfile(userId)
    let filename
  
    try {
      if (request.files) {
        let getFileName = request.files.avatar.name.split("_")[0]
        let getFileExt = request.files.avatar.name.split(".").pop()
        filename = getFileName.replace("image", `${userDb[0].id}-${userDb[0].name}-${new Date().getUTCMilliseconds()}.${getFileExt}`)
        await request.files.avatar.mv(`${process.cwd()}${path}${filename}`)
      }
     
      const data = {
        name: request.body ? request.body.username : userDb[0].name,
        bio: request.body ? request.body.bio : userDb[0].bio,
        avatar: request.files ? filename : userDb[0].avatar
      }
   
      await User.updateProfile(data, userId)
      misc.response(response, 200, false, null, data)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  }

}
