const mongoose = require('mongoose')
const Schema = mongoose.Schema

const callCenterIssuesSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: false },
    middlename: { type: String, required: false },
    number: { type: Number, default: 1 },
    orderNumber: { type: Number },
    numberuid: { type: String },
    phone: { type: String, required: true },
    message: { type: String, required: false },
    region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
    category: { type: Schema.Types.ObjectId, required: true},
    comment: { type: String, required: false },
    status: { type: String, required: false },
    issuedBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    issuedTo: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    confirmedAt: { type: Date, default: null },
}, { timestamps: true })

module.exports = mongoose.model('CallCenterIssues', callCenterIssuesSchema)