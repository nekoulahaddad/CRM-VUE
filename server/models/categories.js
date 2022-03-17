const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriesSchema = new Schema({
    regions: [{
        region: { type: mongoose.Types.ObjectId, ref: 'Regions' },
        category: {
            _id: { type: mongoose.Types.ObjectId },
            nesting: { type: Number, required: true },
            parent_id: { type: mongoose.Types.ObjectId, required: false },
            categoryName: { type: String, required: true },
            cSlug: { type: String, required: false },
            link: { type: String, required: false },
            order: { type: Number },
            img: { type: String, required: false },
            path: { type: String, required: false },
            icon: { type: String, required: false },
            iconPath: { type: String, required: false },
            slide: { type: String, required: false, default: null },
            slidePath: { type: String, required: false, default: null },
            banner: { type: String, required: false, default: null },
            bannerPath: { type: String, required: false, default: null },
            bannerMob: { type: String, required: false, default: null },
            bannerPathMob: { type: String, required: false, default: null },
            description: { type: String },
            manager: { type: mongoose.Types.ObjectId, required: false},
            meta: { type: Object },
            visible: {
                type: Boolean,
                required: false,
                default: true
            },
            views: [{
                type: mongoose.Types.ObjectId,
                required: false
            }],
            filters: { type: Array, required: false, default: null},
            updates: [{
                user: { type: mongoose.Types.ObjectId, ref: 'Users' },
                date: { type: Date, default: new Date() },
                type: { type: String, default: null }
            }],
            deleted: { type: Boolean, required: true, default: 'false' }
        }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Categories', categoriesSchema)