const mongoose = require("mongoose");

const AgencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  address: {
    address_line_1: {
      type: String,
      required: true
    },
    address_line_2: {
      type: String
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    }
  },
  description: {
    type: String
  },
  website: {
    type: String
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  contact_number: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  cover_photo: {
    type: String
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

module.exports = Agency = mongoose.model("agency", AgencySchema);
