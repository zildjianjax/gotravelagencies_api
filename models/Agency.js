const mongoose = require("mongoose");

const AgencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
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
    data: Buffer,
    contentType: String
  },
  cover_photo: {
    data: Buffer,
    contentType: String
  },
  gallery: [
    {
      data: Buffer,
      contentType: String
    }
  ]
}, { timestamps: true });

module.exports = Agency = mongoose.model("Agency", AgencySchema);
