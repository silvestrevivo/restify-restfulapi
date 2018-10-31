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

  // Get Single Costumer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id)
      res.send(customer)
      next()
    } catch (error) {
      return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
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

  // Update Customer
  server.put('/customers/:id', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError(`Expects 'application/json' `))
    }

    try {
      const newcCustomer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body)
      res.send(200)
      next()
    } catch (error) {
      return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
    }
  })

  // Delete Customer
  server.del('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndDelete({ _id: req.params.id })
      res.send(204)
      next()
    } catch (error) {
      return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
    }
  })
}
