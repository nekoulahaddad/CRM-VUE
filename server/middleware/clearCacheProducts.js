const request = require('request')
const Products = require('../models/products')

module.exports = async(req, res, next) => {
    try {
        await request('https://tdcsk.com/api/cache-clear')
        next()
    } catch (error) {
        next(error)
    }
}