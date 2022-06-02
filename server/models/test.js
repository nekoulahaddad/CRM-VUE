const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testSchema = new Schema({
	name: { type: String, required: true },
	number: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('Test', testSchema)