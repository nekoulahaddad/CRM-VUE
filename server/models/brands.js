const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brandsSchema = new Schema({
    regions: [{
        region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
        brand: {
            _id: { type: mongoose.Types.ObjectId },
            name: { type: String, required: true },
            slug: { type: String, required: false },
            link: { type: String, required: false },
            order: { type: Number },
            category_id: { type: mongoose.Types.ObjectId },
            img: { type: String, required: false },
            path: { type: String, required: false },
            description: { type: String },
            meta: { type: Object },
            updates: [{
                user: { type: mongoose.Types.ObjectId, ref: 'Users' },
                date: { type: Date, default: new Date() }
            }],
        }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Brands', brandsSchema)