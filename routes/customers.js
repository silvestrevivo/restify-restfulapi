'use strict'

const errors = require('restify-errors')
const Customer = require('../models/Customer')

module.exports = server => {
  // Get Customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customer = await Customer.find({})
      res.send(customer)
      next()
    } catch (error) {
      return next(new errors.InvalidContentError(err))
    }
  })

  // Add Customer
  server.post('/customers', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError(`Expects 'application/json' `))
    }

    const { name, email, balance } = req.body

    const customer = new Customer({
      name,
      email,
      balance,
    })

    try {
      const newcCustomer = await customer.save()
      res.send(201)
      next()
    } catch (error) {
      return next(new errors.InternalError(err.message))
    }
  })
}
