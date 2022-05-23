const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staticSiteSchema = new Schema(
  {
    url: { type: String, required: true },
    category_id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Categories",
    },
    manager: [{ type: mongoose.Types.ObjectId, required: false, ref: "User" }],
    categories: [{ type: mongoose.Types.ObjectId, required: false }],
    categoryName: { type: String, required: true },
    regions: [{ type: mongoose.Types.ObjectId, required: false }],
    region: { type: mongoose.Types.ObjectId, required: true },
    folder: { type: String, required: true },
    uploadedFile: { type: String, required: false },
    origin: { type: String, required: false },
    content: {
      seo: {
        ym: { type: String, required: false },
      },
      contacts: {
        phones: [{ type: String, required: false }],
        email: [{ type: String, required: false }],
        addresses: [{ type: String, required: false }],
        whatsapp: { type: String, required: false },
        telegram: { type: String, required: false },
      },
      mainBanner: {
        title: { type: String, required: false },
        subTitle: { type: String, required: false },
        price: { type: String, required: false },
        text: { type: String, required: false },
      },
    },
    node: { type: String, required: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("staticSite", staticSiteSchema);
