const express = require("express");
const router = express.Router();
const { all, create } = require("../controllers/agency");

// Validators
const { runValidation } = require("../validators");
const { createValidator } = require("../validators/agency")

router.get("/all", all);
router.post("/", createValidator, runValidation, create);

module.exports = router;
