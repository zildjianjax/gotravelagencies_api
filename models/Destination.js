const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  photos: [
    {
      name: { type: String },
      url: { type: String }
    }
  ],
  date_created: {
    type: Date,
    default: Date.now
  },
  date_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Destination = mongoose.model("destination", DestinationSchema);
