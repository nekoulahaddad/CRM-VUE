const mongoose = require('mongoose')
const Schema = mongoose.Schema

const callsSchema = new Schema({
    entry_id: { type: String },
    call_id: { type: String },
    recording_id: { type: String },
    recording_state: { type: String },
    recording_url: { type: String },
    command_id: { type: String },
    timestamp: { type: String },
    seq: { type: String },
    call_state: { type: String },
    location: { type: String },
    from: { type: Object },
    to: { type: Object },
    disconnect_reason: { type: String },
    callback_initiator: { type: String },
    dct: { type: Object },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Types.ObjectId, ref: 'Clients' },
}, { timestamps: true })

module.exports = mongoose.model('Calls', callsSchema)