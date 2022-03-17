const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = async(req, res, next) => {
    try {
        let token = req.get('Authorization')
        let isBot = req.get('X_BOT')
        if (token && token.includes('Bearer')) {
            let splitToken = token.split(' ')
            token = splitToken[1]
        }
        let decodedToken
        if (isBot) {
            decodedToken = jwt.decode(token, process.env.SECRET_KEY_CLIENTS)
        } else {
            decodedToken = jwt.decode(token, process.env.SECRET_KEY)
        }
        if (!decodedToken) return next(404)
        let user = await User.find({_id: decodedToken.data._id, token: token})
        if(!user){
            return next(404)
        }
        req.userId = decodedToken.data._id
        req.userRole = decodedToken.data.role
        next()
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500
        console.log(error)
        next(error)
    }
}