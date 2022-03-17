const jwt = require('jsonwebtoken')

exports.generateToken = (user) => {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3000,
        data: user,
    }, process.env.SECRET_KEY);
}

exports.generateTokenForClient = (user) => {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3000,
        data: user,
    }, process.env.SECRET_KEY_CLIENTS);
}

exports.generateRefreshToken = (user) => {
    return jwt.sign({
        data: user,
    }, process.env.REFRESH_KEY);
}

exports.generateRefreshTokenForClient = (user) => {
    return jwt.sign({
        data: user,
    }, process.env.REFRESH_KEY_CLIENTS);
}