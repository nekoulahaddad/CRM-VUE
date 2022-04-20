const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educationSchema = new Schema(
  {
    role: { type: String, required: false },
    // category: { type: String, required: false },
    department: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Departments",
    },
    link: { type: String },
    description: {
      requirements: { type: String, required: false },
      responsibilities: { type: String, required: false },
      conditions: { type: String, required: false },
    },
    region: { type: Schema.Types.ObjectId, required: false, ref: "Regions" },
    // department: {
    //     _id: { type:  mongoose.Types.ObjectId},
    //     title: { type: String },
    //     value: { type: String }
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vacancies", educationSchema);
