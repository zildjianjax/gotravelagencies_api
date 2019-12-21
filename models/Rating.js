const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "package"
  },
  body: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Rating = mongoose.model("rating", RatingSchema);
