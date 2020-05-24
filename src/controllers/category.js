const { v4: uuidv4 } = require('uuid');
const config = require('../configs/configs');
const Category = require('../models/Category');
const misc = require('../helpers/response');

module.exports = {
  all: async (request, response) => {
    try {
      const payload = await Category.all();
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  },
  store: async (request, response) => {
    const id = uuidv4();
    const title = request.body.title;
    const color = request.body.color;
    const payload = {
      id,
      title,
      color
    }
    try {
      await Category.store(data);
      misc.response(response, 200, false, null, payload);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error.');
    }
  }
}
