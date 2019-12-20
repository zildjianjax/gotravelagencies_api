const { check } = require("express-validator");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required"),
  check("email")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.signInValidator = [
  check("email")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
