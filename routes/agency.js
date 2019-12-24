const express = require("express");
const router = express.Router();
const {
  all,
  create,
  getLogo,
  updateLogo,
  getAgency,
  getAgencyOwner,
  addMember
} = require("../controllers/agency");

// Validators
const { runValidation } = require("../validators");
const {
  createValidator,
  updateLogoValidator,
  addMemberValidator
} = require("../validators/agency");

// Middlewares
const { requireSignin } = require("../middlewares/auth");
const { formidableForm } = require("../middlewares/form");
const { agencyOwner } = require("../middlewares/agency");

router.get("/all", all); // Get all agencies
router.get("/:slug/logo", getLogo); // Get agency logo
router.get("/:slug", getAgency); // Get agency by slug
router.get("/:slug/owner", getAgencyOwner); // Get agency owner

router.post("/", formidableForm, createValidator, runValidation, create); // Register user and create agency

router.put(
  "/:slug/logo",
  requireSignin,
  agencyOwner,
  formidableForm,
  updateLogoValidator,
  runValidation,
  updateLogo
); // Update agency logo

router.post(
  "/:slug/members",
  requireSignin,
  agencyOwner,
  addMemberValidator,
  runValidation,
  addMember
); // Add member to agency

module.exports = router;
