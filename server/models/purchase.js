const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseSchema = new Schema({
    initiator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    executor: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
    category: { type: Schema.Types.ObjectId, required: true, ref: 'Categories'},
    number: { type: Number, default: 1 },
    orderId: { type: mongoose.Types.ObjectId, required: true, ref: "Orders" },
    orderNumber: { type: Number, required: true },
    products: [
        { type: Object, required: true }
    ],
    message: { type: String, required: false },
    comment: { type: String, required: false },
    status: { type: String, required: false },
    seenAt: { type: Date, default: null },
    deliveryDate: { type: Date, required: false },
}, { timestamps: true })

module.exports = mongoose.model('Purchase', purchaseSchema)