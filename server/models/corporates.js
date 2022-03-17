const mongoose = require('mongoose')

const Schema = mongoose.Schema

const corporatesSchema = new Schema({
    surname: { type: String, required: false },
    name: { type: String, required: false },
    lastname: { type: String, required: false },
    phone: { type: String, required: false, unique: false },
    email: { type: String, required: false },
    company: {
        company_name: { type: String, required: false },
        type_of_agree: { type: String, required: false },
        limit: { type: Number, required: false },
        ac_address: { type: String, required: false },
        payment_acc: { type: String, required: false },
        ur_address: { type: String, required: false },
        inn: { type: String, required: false },
        kpp: { type: String, required: false },
        bik: { type: String, required: false },
    },
    balance: { type: Number, required: false },
    password: { type: String, required: false },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Orders', default: [] }],
    region: { type: Schema.Types.ObjectId, required: false, ref: 'Regions' },
    token: { type: String, required: false, default: null },
    refresh: { type: String, required: false, default: null },
    deleted: { type: Boolean, required: false, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Corporates', corporatesSchema)