const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const eventSchema = new Schema({
    id: { type: Number, required: false },
    initiator: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{
        _id: { type: mongoose.Types.ObjectId, required: false, ref: 'User' }
    }]
}, { timestamps: true })

eventSchema.plugin(AutoIncrement, { inc_field: 'id' })


module.exports = mongoose.model('Events', eventSchema)