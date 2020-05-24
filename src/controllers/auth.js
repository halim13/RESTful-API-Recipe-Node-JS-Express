require('dotenv').config();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const misc = require('../helpers/response');
const jwt = require('jsonwebtoken');
class UserNotExists extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotExists';
  }
}
class NameAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.name = 'NameAlreadyExists';
  }
}
class EmailAddressAlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailAddressAlreadyExists';
  }
}
class InvalidCredentials extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCredentials';
  }
}
module.exports = {
  auth: async (request, response) => {
    const userId = request.user.id;
    try {
      const object = {};
      const data = await User.auth(userId);
      object.id = data[0].id;
      object.name = data[0].name;
      object.email = data[0].email;
      object.avatar = data[0].avatar;
      object.bio = data[0].bio;
      object.expiresIn = 3600; // 1 hour
      // 3600 1 hour
      // 3600 * 24 * 7  week
      // 3600 * 24 * 30 1 month
      // object.expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
      misc.response(response, 200, false, null, object);
    } catch (error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, 'Server Error');
    }
  },
  login: async (request, response) => {
    const { email, password } = request.body;
    try {
      const user = await User.login(email);
      if (user.length === 0) {
        throw new UserNotExists('User not exists.');
      }
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        throw new InvalidCredentials('Invalid Credentials.');
      }
      const payload = {
        user: {
          id: user[0].id
        },
      }
      const token = await jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: '1h' } // 1 hour
      );
      misc.response(response, 200, false, null, token);
    } catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, error.message);
    }
  },
  register: async (request, response) => {
    const { name, email, password } = request.body;
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();
    try {
      const nameExists = await User.checkName(name.toLowerCase());
      const emailExists = await User.checkEmail(email);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      if(nameExists.length === 1) {
        throw new NameAlreadyExists('Name already exists.');
      }
      if(emailExists.length === 1) {
        throw new EmailAddressAlreadyExists('E-mail Address already exists.');
      }
      const data = {
        id,
        name,
        email,
        password: passwordHash,
        created_at: createdAt,
        updated_at: updatedAt
      }
      await User.register(data);
      const user = await User.getUser(email);
      const payload = {
        user: {
          id: user[0].id
        },
      }
      const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: '1h' } // 1 hour
      );
      misc.response(response, 200, false, null, token);
    }
    catch(error) {
      console.log(error.message); // in-development
      misc.response(response, 500, true, error.message);
    }
  },
}
