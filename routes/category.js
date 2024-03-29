const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/category");

// Validators
const { runValidation } = require("../validators");
const { createValidator } = require("../validators/category");
const { requireSignin, adminMiddleware } = require("../middlewares/auth");

router.post(
  "/category",
  createValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/categories", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
