const request = require('request')
const Categories = require('../models/categories')

module.exports = async(req, res, next) => {
    try {
        await request('https://tdcsk.com/api/cache-clear')
        next()
    } catch (error) {
        next(error)
    }
}





// [HOST]/api/cache-clear?collection=[COLLECTION_NAME]