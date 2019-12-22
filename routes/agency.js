const express = require("express");
const router = express.Router();
const { all, create } = require("../controllers/agency");

// Validators
const { runValidation } = require("../validators");
const { createValidator } = require("../validators/agency")

// Middlewares
const { formidableForm } = require("../middlewares/form");

router.get("/all", all);
router.post("/", formidableForm, createValidator, runValidation, create);

module.exports = router;
