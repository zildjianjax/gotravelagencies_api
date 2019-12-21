const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT  = bcrypt.genSaltSync(10);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    about: {
      type: String
    },
    is_admin: {
      type: Boolean,
      default: false
    },

    // to be removed
    role: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ""
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, SALT);
  next();
});

userSchema.methods.comparePassword = function(plaintext) {
  return bcrypt.compareSync(plaintext, this.password);
};

module.exports = mongoose.model("User", userSchema);
