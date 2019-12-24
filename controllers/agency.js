const Agency = require("../models/Agency");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { registerUser } = require("./auth");

/**
 * @api {get} /agency/all Get All Agency
 * @apiName GetAllAgency
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {Object[]} data An array of agency model.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "success": 1,
 *      "data": [
 *        {
 *          "address": {
 *            "address_line_1": "421 Upper Tulay",
 *            "address_line_2": "Sitio",
 *            "country": "Philippines",
 *            "city": "Minglanilla",
 *            "state": "Cebu",
 *            "zipcode": "6046"
 *          },
 *          "members": [],
 *          "followers": [],
 *          "is_active": true,
 *          "_id": "5e01a6e8c9dccd4f540d7a6e",
 *          "gallery": [],
 *          "name": "Shadow Travel and tours 2",
 *          "slug": "shadow-travel-and-tours-2",
 *          "email": "shadowtravelandtours23@gmail.com",
 *          "contact_number": "09565379056",
 *          "owner": {
 *            "_id": "5e01a6e7c9dccd4f540d7a6d",
 *            "email": "james@gmail.com",
 *            "username": "dspu36dn",
 *            "profile": "http://localhost:3000/profile/dspu36Dn"
 *          },
 *          "createdAt": "2019-12-24T05:49:28.056Z",
 *          "updatedAt": "2019-12-24T05:51:42.210Z",
 *          "__v": 0
 *        }
 *      ]
 *    }
 */
exports.all = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const agencies = await Agency.find()
      .populate("owner", "_id username email profile")
      .select("-logo")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.json({ success: 1, data: agencies });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
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
 * @apiParam {String} [agency_email] Email of the agency.
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

    const email = agency_email || fields.email;

    // Check if agency already registered
    const existing_agency = await Agency.findOne({ email });
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
    agency.slug = slugify(agency_name).toLowerCase();
    agency.email = email;
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

/**
 * @api {get} /agency/:slug/logo Get Agency Logo
 * @apiName GetAgencyLogo
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    "The logo image"
 */
exports.getLogo = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const agency = await Agency.findOne({ slug }).select("logo");
    res.set("Content-Type", agency.logo.contentType);
    res.send(agency.logo.data);
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

/**
 * @api {put} /agency/:slug/logo Update Agency Logo
 * @apiName PutUpdateAgencyLogo
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiDescription Request data must be a formdata, not json.
 *
 * @apiParam {File} logo Logo of the agency.
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {String} msg Success message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "success": 1,
 *        "msg": "Logo updated successfully!"
 *      }
 */
exports.updateLogo = async (req, res) => {
  try {
    const { files } = req.body;
    const slug = req.params.slug.toLowerCase();

    // Check if agency already registered
    const agency = await Agency.findOne({ slug });

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

    res.json({ success: 1, msg: "Logo updated successfully!" });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

/**
 * @api {get} /agency/:slug Get Agency
 * @apiName GetAgency
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {Object} data The agency object model.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "success": 1,
 *      "data": {
 *        "address": {
 *          "address_line_1": "421 Upper Tulay",
 *          "address_line_2": "Sitio",
 *          "country": "Philippines",
 *          "city": "Minglanilla",
 *          "state": "Cebu",
 *          "zipcode": "6046"
 *        },
 *        "members": [],
 *        "followers": [],
 *        "is_active": true,
 *        "_id": "5e01a6e8c9dccd4f540d7a6e",
 *        "name": "Shadow Travel and tours 2",
 *        "slug": "shadow-travel-and-tours-2",
 *        "email": "shadowtravelandtours23@gmail.com",
 *        "contact_number": "09565379056",
 *        "owner": {
 *          "_id": "5e01a6e7c9dccd4f540d7a6d",
 *          "name": "James",
 *          "username": "dspu36dn",
 *          "profile": "http://localhost:3000/profile/dspu36Dn"
 *        },
 *        "createdAt": "2019-12-24T05:49:28.056Z",
 *        "updatedAt": "2019-12-24T05:51:42.210Z",
 *        "__v": 0
 *      }
 *    }
 */
exports.getAgency = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    // Check if agency already registered
    const agency = await Agency.findOne({ slug })
      .populate("owner", "_id name username profile")
      .select("-logo -cover_photo -gallery");

    res.json({ success: 1, data: agency });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

/**
 * @api {get} /agency/:slug/owner Get Agency Owner
 * @apiName GetAgencyOwner
 * @apiGroup Agency
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {Object} data The user object of the owner.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "success": 1,
 *      "data": {
 *        "_id": "5e01a6e7c9dccd4f540d7a6d",
 *        "name": "James",
 *        "username": "dspu36dn",
 *        "profile": "http://localhost:3000/profile/dspu36Dn"
 *      }
 *    }
 */
exports.getAgencyOwner = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    // Check if agency already registered
    const agency = await Agency.findOne({ slug })
      .populate("owner", "_id name username profile")
      .select("owner");

    res.json({ success: 1, data: agency.owner });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

/**
 * @api {post} /agency/:slug/members Add members to agency
 * @apiName PostAddMembers
 * @apiGroup Agency
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} user User id of the member you want to add.
 *
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {Object[]} data Array of user object.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "success": 1,
 *      "data": [
 *        {
 *          "_id": "5e01a6f6c9dccd4f540d7a6f",
 *          "name": "Jax",
 *          "email": "jax@gmail.com",
 *          "username": "uj7vsam2",
 *          "profile": "http://localhost:3000/profile/UJ7VSAM2"
 *        },
 *        {
 *          "_id": "5e01bc89741cc819004bdd74",
 *          "name": "Jax",
 *          "email": "zildjian@gmail.com",
 *          "username": "ultutsi1",
 *          "profile": "http://localhost:3000/profile/UltutSi1"
 *        }
 *      ]
 *    }
 */
exports.addMember = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const { users } = req.body;

    // Check if agency already registered
    const agency = await Agency.findOneAndUpdate({ slug }, {
      $addToSet: {
        members: users
      }      
    }, {
      new: true
    }).populate("members", "_id name username profile email");

    res.json({ success: 1, data: agency.members });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
