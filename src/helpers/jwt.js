require('dotenv').config();
const misc = require('../helpers/response');
const jwt = require('jsonwebtoken');
module.exports = function(request, response, next) {
  const token = request.header('x-auth-token');
  if (!token) {
    return misc.response(response, 401, true, 'No token, authorization denied.');
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if(error) {
        misc.response(response, 401, true, 'Token is not valid.');
      }
      else {
        request.user = decoded.user;
        next();
      }
    })
  }
  catch (error) {
    console.log(error.message); // in-development
    misc.response(response, 500, true, 'Server Error.');
  }
}
