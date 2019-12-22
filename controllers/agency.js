const Agency = require("../models/Agency");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { registerUser } = require("./auth");

exports.all = (req, res) => {
  res.send("Agency API");
};

exports.create = async (req, res) => {
  try {
    const { fields, files } = req.body;
    const {
      agency_name,
      agency_email,
      address_line_1,
      address_line_2,
      country,
      city,
      state,
      zipcode,
      contact_number
    } = fields;

    // Check if agency already registered
    const existing_agency = await Agency.findOne({ email: agency_email });
    if (existing_agency) {
      return res.status(400).json({ error: 1, msg: "Agency already taken." });
    }

    // User creation/registration
    user = await registerUser(fields, true);
    if (user.error) {
      return res.status(400).json(user);
    }

    let agency = new Agency();
    agency.name = agency_name;
    agency.email = agency_email;
    agency.address = {};
    agency.address.address_line_1 = address_line_1;
    agency.address.address_line_2 = address_line_2;
    agency.address.country = country;
    agency.address.city = city;
    agency.address.state = state;
    agency.address.zipcode = zipcode;
    agency.contact_number = contact_number;
    agency.owner = user._id;

    // photo logic
    if (files.logo) {
      if (files.logo.size > 10000000) {
        return res.status(400).json({
          error: 1,
          msg: "Image should be less than 1mb in size."
        });
      }

      agency.logo.data = fs.readFileSync(files.logo.path);
      agency.logo.contentType = files.logo.type;
    }

    await agency.save();

    user.agency = agency._id;
    await user.save();

    user.password = undefined;
    agency.logo = undefined;

    return res.json({
      success: 1,
      user: user,
      agency: agency
    });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
