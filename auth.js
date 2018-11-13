'use strict'

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./models/User')

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by email
      const user = await User.findOne({ email })

      // Match de password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          resolve(user)
        } else {
          reject('Authentication failed')
        }
      })
    } catch (error) {
      //Email not found
      reject('Authentication failed')
    }
  })
}
