const { check } = require("express-validator");

exports.createValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required."),
  check("email")
    .isEmail()
    .withMessage("Email is not valid."),
  check("address.address_line_1")
    .notEmpty()
    .withMessage("Address Line 1 is required."),
  check("address.country")
    .notEmpty()
    .withMessage("Country is required."),
  check("address.city")
    .notEmpty()
    .withMessage("City is required."),
  check("address.zipcode")
    .notEmpty()
    .withMessage("Zip Code is required."),
  check("contact_number")
    .notEmpty()
    .withMessage("Zip Code is required.")
];
