const bcrypt = require('bcrypt');

exports.generatePassword = async(password) => {
    let saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}


exports.comparePasswords = async(password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword)
}