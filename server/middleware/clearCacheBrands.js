const request = require('request')
const Brands = require('../models/brands')

module.exports = async(req, res, next) => {
    try {
        await request('https://tdcsk.com/api/cache-clear').then(async(res) => {
            console.log(await res)
        })
        next()
    } catch (error) {
        next(error)
    }
}





// [HOST]/api/cache-clear?collection=[COLLECTION_NAME]