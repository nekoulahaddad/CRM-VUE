const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clientsSchema = new Schema({
    // Физическое лицо
    // ФИО
    surname: { type: String, required: false },
    name: { type: String, required: false },
    lastname: { type: String, required: false },

    // Юридическое лицо
    bank: { type: String, required: false },
    organisation: { type: String, required: false },
    checking_account: { type: String, required: false },
    inn: { type: String, required: false },
    kpp: { type: String, required: false },
    okpo: { type: String, required: false },
    director: { type: String, required: false },
    ur_address: { type: String, required: false },
    account_number: { type: String, required: false },
    ownership: {type: String, required: false},
    ur_actualAddress: {type: String, required: false},
    ur_corScore: {type: String, required: false},
    bik: { type: String, required: false },

    // Общее
    // Личная информация
    email: { type: String, required: false },
    password: { type: String, required: false },
    phone: { type: String, required: true, unique: true },
    club_cart: { type: String, required: false, default: null },
    birthday: { type: Date, required: false, default: null },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Orders', default: [] }],
    region: { type: Schema.Types.ObjectId, required: false, ref: 'Regions' },
    token: { type: String, required: false, default: null },
    refresh: { type: String, required: false, default: null },    
    deleted: { type: Boolean, required: false, default: false },    
}, { timestamps: true })

module.exports = mongoose.model('Clients', clientsSchema)