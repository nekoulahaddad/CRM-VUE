const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orderSchema = new Schema({
    number: { type: Number, required: true },
    created: { type: Date, required: true, default: new Date() },
    buyed: { type: Date, required: false },
    region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
    products: [{
        cost: { type: Number, required: true, },
        club_cost: { type: Number, required: false, default: null },
        discount_price: { type: Number, required: false, default: null },
        product_id: { type: mongoose.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        title: { type: String, required: false },
        article: { type: Number, required: false },
    }],
    status: { type: mongoose.Types.ObjectId, required: true, ref: 'Conditions' },
    deliver: { type: Date, required: false },
    typeDelivery: { type: String, required: false, default: 'pickup' },
    delivery: {
        city: { type: String },
        street: { type: String },
        house: { type: String },
        building: { type: String },
        appt: { type: String },
    },
    deliverySum: { type: Number, required: false, default: 0 },
    deliveryRequest: { type: String, required: false, default: null},
    shippedSum: { type: Number, required: false, default: 0 },
    oneC: {
        requested: { type: Boolean, required: false, default: false },
        accepted: { type: Boolean, required: false, default: false }
    },
    profit: { type: Number, required: false, default: 0 },
    acquiringNum: { type: String, required: true, default: null },
    numberuid: { type: String },
    payment: { type: String },
    paymentStatus: {type: Number, required: false, default: null},
    client: { type: mongoose.Types.ObjectId, ref: "Clients" },
    comment: { type: String },
    manager: [{ type: mongoose.Types.ObjectId, required: false }],
    manager_comment: { type: String, required: false },
    sum: { type: Number, required: false },
    type: { type: String, required: false },
    declainReason: { type: String, required: false, default: null },
    deleted: { type: Boolean, required: false, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Orders', orderSchema)