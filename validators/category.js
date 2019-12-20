const { check } = require("express-validator");

exports.createValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
];
