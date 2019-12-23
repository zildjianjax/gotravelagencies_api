const express = require("express");
const router = express.Router();
const { all, create, getLogo } = require("../controllers/agency");

// Validators
const { runValidation } = require("../validators");
const { createValidator } = require("../validators/agency")

// Middlewares
const { formidableForm } = require("../middlewares/form");

router.get("/all", all);
router.post("/", formidableForm, createValidator, runValidation, create);
router.get("/:slug/logo", getLogo);

module.exports = router;
