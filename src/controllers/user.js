const resolve = require('path').resolve;
const misc = require('../helpers/response');
const slug = require('../helpers/slugify');
const fs = require('fs-extra');
const User = require('../models/User');
module.exports = {
  getProfile: async (request, response) => {
    const userId = request.params.userId;
    try {
      const getProfile = await User.getProfile(userId);
      misc.response(response, 200, false, null, getProfile);
    } catch(error) {
      console.log(error.messsage); // in-development
      misc.response(response, 500, true, 'Server error.');
    }
  },
  updateProfile: async (request, response) => {
    const userId = request.params.userId;
    const userDb = await User.getProfile(userId);
    let error = false;
    let filename;
    let extension;
    let size;
    if(request.file) {
      filename = `${request.file.fieldname}-${slug.string_to_slug(userDb[0].name)}.jpg`;
      extension =  request.file.mimetype;
    }

    try {
      if(request.file) {
        if(request.file.size >= 5242880) { // 5MB
          error = true;
          fs.unlink(`public/images/avatar/${filename}`);
          throw new Error('Oops! size cannot more than 5MB.');
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
    //   function isImage(extension) {
    //     switch (extension) {
    //       case 'image/png':
    //       case 'image/jpeg':
    //       case 'image/gif':
    //       case 'image/bmp':
    //       case 'image/svg+xml':
    //         return true;
    //     }
    //   return false;
    // }
    let data = {
      name: request.body ? request.body.username : userDb[0].name,
      bio: request.body ? request.body.bio : userDb[0].bio,
      avatar: filename ? filename : userDb[0].avatar
    };
    if(error === false) {
      await User.updateProfile(data, userId);
      misc.response(response, 200, false, null, data);
    }
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  }
}
