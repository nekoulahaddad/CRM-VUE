const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupsSchema = new Schema({
    regions: [{
        region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
        group: {
            _id: { type: mongoose.Types.ObjectId, required: true },
            title: { type: String, required: true },
            slug: { type: String, required: true },
            category_id: { type: mongoose.Types.ObjectId, required: true },
            products: [{ type: mongoose.Types.ObjectId, required: true }],
            visible: { type: Boolean, required: true, default: true },
            groupProperties: {type: String, required: true }

        }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Groups', groupsSchema)