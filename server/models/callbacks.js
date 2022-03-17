const mongoose = require('mongoose')
const Schema = mongoose.Schema

const callBacksSchema = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: false },
    orderId: { type: mongoose.Types.ObjectId },
    phone: { type: String, required: true },
    regionTitle: { type: String, required: true },
    region: { type: mongoose.Types.ObjectId, required: true, ref: "Regions" },
    typeForm: { type: String, required: true },
    client: { type: mongoose.Types.ObjectId, required: false, ref: "Clients" },
    company: { type: String, required: false },
    inn: { type: String, required: false },
    comment: { type: String, required: false },
    status: { type: Boolean, required: false, default: false },
    manager: { type: mongoose.Types.ObjectId, required: false },
    path: { type: String },
    zip: { type: String },
    zipPath: { type: String },
    documents: { type: Array },
    deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('callbacks', callBacksSchema)