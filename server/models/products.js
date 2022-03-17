const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
    regions: [{
        region: { type: mongoose.Types.ObjectId, required: true, ref: 'Regions' },
        product: {
            _id: { type: mongoose.Types.ObjectId },
            category_id: { type: mongoose.Types.ObjectId, required: true },
            brand_id: { type: mongoose.Types.ObjectId, required: false },
            article: { type: Number, required: true },
            supplier_article: { type: Number, required: false },
            rrp: { type: Number, required: false },
            purchase_cost: { type: Number, required: false },
            margin: { type: Number, required: false },
            discount_percent: { type: Number, required: false },
            stop_cost: { type: Number, required: false },
            slug: { type: String, required: true },
            images: { type: Array, required: true },
            options: { type: Array, required: true },
            link: { type: String, required: false },
            title: { type: String, required: true },
            path: { type: String, required: true },
            cost: { type: Number, required: true },
            club_cost: { type: Number, required: false },
            full_cost: { type: Number, required: false },
            full_club_cost: { type: Number, required: false },
            discount: { type: Boolean, required: false, default: false },
            wholesale: { type: Boolean, required: false, default: false },
            discount_price: { type: Number, required: false },
            discount_full_price: { type: Number, required: false },
            recomended: [{
                title: { type: String, required: false },
                product_id: { type: mongoose.Types.ObjectId, required: false }
            }],
            buyed: [{
                title: { type: String, required: false },
                product_id: { type: mongoose.Types.ObjectId, required: false }
            }],
            buyed_count: {
                type: Number,
                required: false,
                default: 0
            },
            unit: { type: String, required: true },
            coef: { type: Number, required: true, default: 1 },
            description: { type: String, required: false },
            meta: {
                title: { type: String },
                keywords: { type: String },
                description: { type: String }
            },
            providers: [{
                _id: { type: mongoose.Types.ObjectId, required: false, ref: "Providers" },
                name: { type: String, required: false }
            }],
            minq: {
                type: Number,
                required: false
            },
            remains: {
                type: Number,
                required: false
            },
            visible: {
                type: Boolean,
                required: false,
                default: true
            },
            updates: [{
                user: { type: mongoose.Types.ObjectId, ref: 'Users' },
                date: { type: Date, default: new Date() }
            }],
            group: { type: Boolean, required: true, default: false },
            group_id: { type: mongoose.Types.ObjectId, required: false },
            UUID: { type: String },
            deleted: { type: Boolean, required: true, default: 'false' },
            groupProperties: {type: String, required: false}
        }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Products', productsSchema)