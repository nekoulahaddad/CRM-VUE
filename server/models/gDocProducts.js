const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gDocProductShema = new Schema({
    spreadsheetId: { type: String, required: true },
    region: { type: mongoose.Types.ObjectId, required: false, ref: "Regions" },
    sheets: { type: Array, required: false, default: null}
}, { timestamps: true })

module.exports = mongoose.model('gDocProduct', gDocProductShema)