'use strict'

const errors = require('restify-errors')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../auth')
const config = require('../config/config')


module.exports = server => {
  // Register User
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body

    const user = new User({
      email,
      password,
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash
        // Save user
        try {
          const newUser = await user.save()
          res.send(201)
          next()
        } catch (err) {
          return next(new errors.InternalError(err.message))
        }
      })
    })
  })

  // Auth User
  server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body
    try {
      // Authenticate user
      const user = await auth.authenticate(email, password)

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      })

      const { iat, exp } = jwt.decode(token)
      // Respond with token
      res.send({ iat, exp, token })

    } catch (error) {
      // User unauthorized
      return next(new errors.UnauthorizedError(error))
    }
  })
}
