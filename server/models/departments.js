const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departmentSchema = new Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
    leader: { type: mongoose.Types.ObjectId, required: false}
}, { timestamps: true })

module.exports = mongoose.model('Departments', departmentSchema)