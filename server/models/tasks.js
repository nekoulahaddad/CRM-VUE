const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tasksSchema = new Schema({
    title: { type: String, required: true },
    executors: [
        { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    ],
    initiator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    executor: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    responsible: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    department: { type: Schema.Types.ObjectId, required: false, ref: 'Departments' },
    description: { type: String, required: false },
    creation_date: { type: Date, default: Date.now },
    documents: { type: Array, required: false },
    deadline_date: { type: Date, required: true },
    status: { type: Schema.Types.ObjectId, required: false, ref: 'Status', default: '601bad4735e4052ee544d788' },
    mark: { type: Number, required: false, default: null },
    comment: { type: String, required: false, default: '' },
    initiator_comment: { type: String, required: false, default: '' },
    parent_id: { type: Schema.Types.ObjectId, required: false },
}, { timestamps: true })

module.exports = mongoose.model('Tasks', tasksSchema)