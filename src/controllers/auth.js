require("dotenv").config()
const User = require("../models/User")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")
const misc = require("../helpers/response")
const jwt = require("jsonwebtoken")

class UserNotExists extends Error {
  constructor(message) {
    super(message)
    this.name = "UserNotExists"
  }
}
class NameAlreadyExists extends Error {
  constructor(message) {
    super(message)
    this.name = "NameAlreadyExists"
  }
}
class EmailAddressAlreadyExists extends Error {
  constructor(message) {
    super(message)
    this.name = "EmailAddressAlreadyExists"
  }
}
class InvalidCredentials extends Error {
  constructor(message) {
    super(message)
    this.name = "InvalidCredentials"
  }
}

module.exports = {

  auth: async (request, response) => {
    const uuid = request.decoded.user.uuid
    const exp = request.decoded.exp // Expired token
    try {
      const userLoggedIn = await User.auth(uuid)
      let data = {
        id: userLoggedIn[0].id,
        uuid: userLoggedIn[0].uuid,
        name: userLoggedIn[0].name,
        email: userLoggedIn[0].email,
        avatar: userLoggedIn[0].avatar,
        bio: userLoggedIn[0].bio,
        expiresIn: exp
      }
      misc.response(response, 200, false, null, data)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, "Server Error")
    }
  },

  refreshToken: async (request, response) => {
    const { token } = request.body
    const decoded = jwt.decode(token, { complete: true })
    const payload = {
      user: {
        uuid: decoded.payload.user.uuid
      }
    }
    const refreshToken = await jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_LIFE } // 1 Week
    )
    misc.response(response, 200, false, null, refreshToken)
  },

  login: async (request, response) => {
    const { email, password } = request.body
    try {
      const user = await User.login(email)
      if (user.length === 0) {
        throw new UserNotExists("User not exists")
      }
      const isMatch = await bcrypt.compare(password, user[0].password)
      if (!isMatch) {
        throw new InvalidCredentials("Invalid Credentials")
      }
      const payload = {
        user: {
          uuid: user[0].uuid
        }
      }
      const token = await jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: process.env.TOKEN_LIFE } // 1 Hour
      )
      misc.response(response, 200, false, null, token)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, error.message)
    }
  },

  register: async (request, response) => {
    const { name, email, password } = request.body
    const uuid = uuidv4()
    const createdAt = new Date()
    const updatedAt = new Date()
    try {
      const nameExists = await User.checkName(name.toLowerCase())
      const emailExists = await User.checkEmail(email)
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)
      if (nameExists.length === 1) {
        throw new NameAlreadyExists("Name already exists")
      }
      if (emailExists.length === 1) {
        throw new EmailAddressAlreadyExists("E-mail Address already exists")
      }
      const data = {
        uuid,
        name,
        email,
        password: passwordHash,
        created_at: createdAt,
        updated_at: updatedAt
      }
      await User.register(data)
      const user = await User.getUser(email)
      const payload = {
        user: {
          uuid: user[0].uuid
        }
      }
      const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: "1h" } // 1 Hour
      )
      misc.response(response, 200, false, null, token)
    } catch (error) {
      console.log(error.message) // in-development
      misc.response(response, 500, true, error.message)
    }
  }

}
