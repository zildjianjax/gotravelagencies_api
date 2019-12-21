const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agency"
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "destination"
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "destination"
  },
  description: String,
  inclusions: [String],
  exclusions: [String],
  days: String,
  photos: [
    {
      name: { type: String },
      url: { type: String }
    }
  ],
  travel_period: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  selling_period: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  price: {
    type: Number,
    required: true
  },
  reservation_fee: Number,
  flight_details: {
    origin_to_destination: String,
    destination_to_origin: String
  },
  itinerary: [
    {
      order: Number,
      body: {
        type: String,
        required: true
      }
    }
  ],
  available_payment_options: [String],
  terms_and_conditions: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
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

module.exports = Package = mongoose.model("package", PackageSchema);
