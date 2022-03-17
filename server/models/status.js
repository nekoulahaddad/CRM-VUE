const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statusSchema = new Schema(
    {
        title: { type: String, required: true },
        value: { type: String, required: true }
    }
)

module.exports = mongoose.model('Status', statusSchema)