const mongoose = require('mongoose')
const Schema = mongoose.Schema

const educationSchema = new Schema({
    title: { type: String, required: true },
    role: { type: String, required: false, default: "all" },
    department: { type: String, required: false, default: "all" },
    type: { type: String, required: true },
    description: { type: String, required: true },
    // department: {
    //     _id: { type:  mongoose.Types.ObjectId},
    //     title: { type: String },
    //     value: { type: String }
    // },
    documents: [{
        title: { type: String },
        path: { type: String },
        document: { type: String }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Education', educationSchema)