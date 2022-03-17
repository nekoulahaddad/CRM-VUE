const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConditionsSchema = new Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: String, required: false }
})

module.exports = mongoose.model('Conditions', ConditionsSchema)