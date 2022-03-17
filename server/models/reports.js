const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const reportSchema = new Schema(
    {
        number: { type: Number },
        task: { type: mongoose.Types.ObjectId, ref: 'Tasks'},
        closed: { type: Date, required: true, default: Date.now },
    },
	{ timestamps: true }
)

reportSchema.plugin(AutoIncrement, { inc_field: 'number' })

module.exports = mongoose.model('Reports', reportSchema)
