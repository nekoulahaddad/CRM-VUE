const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const orgTreeSchema = new Schema({
//     departmentId: { type: Schema.Types.ObjectId, required: true, ref: 'Departments' },
//     parentId: { type: Schema.Types.ObjectId, required: false, ref: 'Departments' },
//     rootId: { type: Schema.Types.ObjectId, required: false, ref: 'Departments' },
//     children: { type: Array, required: false },
//     directors: { type: Array, required: false },
//     employees: { type: Array, required: false }
// }, { timestamps: true })

const orgTreeSchema = new Schema({
    dataTree: { type: Object, required: true }
}, { timestamps: true })

module.exports = mongoose.model('OrgTree', orgTreeSchema)