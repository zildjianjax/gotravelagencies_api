const express = require("express");
const router = express.Router();
const { all, create, getLogo, updateLogo } = require("../controllers/agency");

// Validators
const { runValidation } = require("../validators");
const { createValidator, updateLogoValidator } = require("../validators/agency");

// Middlewares
const { requireSignin } = require("../middlewares/auth");
const { formidableForm } = require("../middlewares/form");
const { agencyOwner } = require("../middlewares/agency");

router.get("/all", all);
router.post("/", formidableForm, createValidator, runValidation, create);
router.get("/:slug/logo", getLogo);
router.put("/:slug/logo", requireSignin, agencyOwner, formidableForm, updateLogoValidator, runValidation, updateLogo);

module.exports = router;
