const { check } = require("express-validator");

exports.createValidator = [
  check("fields.name")
    .notEmpty()
    .withMessage("Name is required."),
  check("fields.email")
  .isEmail()
  .withMessage("Email is not valid."),
  check("fields.password")
    .notEmpty()
    .withMessage("Password is required."),
  check("fields.agency_name")
    .notEmpty()
    .withMessage("Agency Name is required."),
  check("fields.address_line_1")
    .notEmpty()
    .withMessage("Address Line 1 is required."),
  check("fields.country")
    .notEmpty()
    .withMessage("Country is required."),
  check("fields.city")
    .notEmpty()
    .withMessage("City is required."),
  check("fields.state")
    .notEmpty()
    .withMessage("State is required."),
  check("fields.zipcode")
    .notEmpty()
    .withMessage("Zip Code is required."),
  check("fields.contact_number")
    .notEmpty()
    .withMessage("Contact number is required.")
];
