const mongoose = require('mongoose')
const Schema = mongoose.Schema

const regionSchema = new Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
    ISO: { type: String, required: false },
    email: { type: String, required: false },
    order: { type: Number, required: false },
    phones: { type: Array, required: false },
    sales: { type: Array, required: false, default: [] },
    msales: { type: Array, required: false, default: [] },
    path: { type: String, required: false },
    valute: {
        type: Object,
        required: false,
        default: {
            code: 'RUR',
            icon: '₽'
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('Regions', regionSchema)