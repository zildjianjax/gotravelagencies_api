const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 160
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {},
      required: true,
      min: 200,
      max: 2000000
    },
    excerpt: {
      type: String,
      max: 1000
    },
    mtitle: String,
    mdesc: String,
    photo: {
      data: Buffer,
      contentType: String
    },
    categories: [{ type: ObjectId, ref: "Category" }],
    tags: [{ type: ObjectId, ref: "Tag" }],
    postedBy: {
      type: ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
