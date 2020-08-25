const resolve = require("path").resolve
const misc = require("../helpers/response")
const slug = require("../helpers/slugify")
const fs = require("fs-extra")
const User = require("../models/User")
module.exports = {
  getProfile: async (request, response) => {
    const userId = request.params.userId
    try {
      const getProfile = await User.getProfile(userId)
      misc.response(response, 200, false, null, getProfile)
    } catch (error) {
      console.log(error.messsage) // in-development
      misc.response(response, 500, true, "Server error.")
    }
  },
  updateProfile: async (request, response) => {
    const path = "/public/images/avatar/"
    const userId = request.params.userId
    const userDb = await User.getProfile(userId)
    let filename
    let extension
    let size
  
    try {
      if (request.files) {
        if (request.files.avatar.size >= 5242880) {
          // 5MB
          fs.unlink(`public/images/avatar/${filename}`)
          throw new Error("Oops! size cannot more than 5MB.")
        }

        // fs.existsSync cek apakah file nya ada apa ngga kalo sync ga pake callback lebih tepat digunakan di try catch
        // fs.writeFileSync menyimpan file tanpa callback lebih tepat digunakan di try catch
        // fs.unlinkSync menghapus file tanpa callback lebih tepat digunakan di try catch

        // if(!isImage(extension)) {
        //   error = true;
        //   fs.unlink(`public/images/avatar/${filename}`);
        //   throw new Error('Oops! file allowed only JPG, JPEG, PNG, GIF, SVG.');
        // }
      }

      if (request.files) {
        let getFileName = request.files.avatar.name.split("_")[0]
        let getFileExt = request.files.avatar.name.split(".").pop()
        filename = getFileName.replace("image", `${userDb[0].id}-${userDb[0].name}-${new Date().getUTCMilliseconds()}.${getFileExt}`)
        await request.files.avatar.mv(`${process.cwd()}${path}${filename}`)
      }
     
      let data = {
        name: request.body ? request.body.username : userDb[0].name,
        bio: request.body ? request.body.bio : userDb[0].bio,
        avatar: request.files ? filename : userDb[0].avatar
      }
   
      await User.updateProfile(data, userId)
      misc.response(response, 200, false, null, data)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error.")
    }
  }
}
