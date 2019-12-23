const Agency = require("../models/Agency");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { registerUser } = require("./auth");

exports.all = (req, res) => {
  res.send("Agency API");
};

/**
 * @api {post} /agency Register Agency
 * @apiName PostRegisterAgency
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiDescription Registers a user with agency. <br />
 * Request must be a formdata, not json.
 *
 * @apiParam {String} name Name of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 * @apiParam {String} agency_name Name of the agency.
 * @apiParam {String} agency_email Email of the agency.
 * @apiParam {String} address_line_1 Address line 1 of the agency location.
 * @apiParam {String} [address_line_2] Address line 2 of the agency location.
 * @apiParam {String} country Country of the agency location.
 * @apiParam {String} city City of the agency location.
 * @apiParam {String} state State of the agency location.
 * @apiParam {Number} zipcode Zip/Postal code of the agency location.
 * @apiParam {String} contact_number Contact number of the agency.
 * @apiParam {File} [logo] Logo of the agency.
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {Object} user User object.
 * @apiSuccess {Object} agency Agency object.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": 1,
 *        "user": {
 *          "is_admin": false,
 *          "role": 0,
 *          "_id": "5dfffabeb9e6e026b421039f",
 *          "name": "Jax",
 *          "email": "james1@gmail.com",
 *          "username": "tjrbzzg3",
 *          "profile": "http://localhost:3000/profile/tJrBZZg3",
 *          "createdAt": "2019-12-22T23:22:38.448Z",
 *          "updatedAt": "2019-12-22T23:22:39.426Z",
 *          "__v": 0,
 *          "agency": "5dfffabeb9e6e026b42103a0"
 *        },
 *        "agency": {
 *          "address": {
 *              "address_line_1": "421 Upper Tulay",
 *              "address_line_2": "Sitio",
 *              "country": "Philippines",
 *              "city": "Minglanilla",
 *              "state": "Cebu",
 *              "zipcode": "6046"
 *          },
 *          "members": [],
 *          "followers": [],
 *          "is_active": true,
 *          "_id": "5dfffabeb9e6e026b42103a0",
 *          "gallery": [],
 *          "name": "Shadow Travel and tours",
 *          "email": "shadowtravelandtours1@gmail.com",
 *          "contact_number": "09565379056",
 *          "owner": "5dfffabeb9e6e026b421039f",
 *          "createdAt": "2019-12-22T23:22:38.944Z",
 *          "updatedAt": "2019-12-22T23:22:38.944Z",
 *          "__v": 0
 *        }
 *    }
 */
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
