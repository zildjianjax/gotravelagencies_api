const express = require("express");
const router = express.Router();
const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../middlewares/auth");
const { read } = require("../controllers/user");

router.get("/profile", requireSignin, authMiddleware, read);
router.get("/profile/admin", requireSignin, adminMiddleware, read);

module.exports = router;
