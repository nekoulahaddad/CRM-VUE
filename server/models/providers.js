const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const providersSchema = new Schema({
    name: { type: String, required: true },
    site: { type: String, required: false },
    inn: { type: String, required: false },
    office_address: { type: String, required: false },
    warehouse_address: { type: String, required: false },
    categories: [
        { type: mongoose.Types.ObjectId, required: false }
    ],
    specialist: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        birth: { type: Date, required: false },
        messengers: [
            {
                name: { type: String, required: false },
                phone: { type: String, required: false },
            }            
        ]
    },
    director: {
        name: { type: String, required: false },
        phone: { type: String, required: false },
        email: { type: String, required: false },
        birth: { type: Date, required: false },
    },
    region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' }

}, { timestamps: true })

module.exports = mongoose.model('Providers', providersSchema)