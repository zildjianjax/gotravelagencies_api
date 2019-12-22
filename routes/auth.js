const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth");
const { requireSignin, authMiddleware } = require("../middlewares/auth");

// Validators
const { runValidation } = require("../validators");
const { signUpValidator, signInValidator } = require("../validators/auth");

router.post("/register", signUpValidator, runValidation, register);
router.post("/login", signInValidator, runValidation, login);
router.get("/logout", logout);
// test
router.get("/secret", requireSignin, authMiddleware, (req, res) => {
  res.json({ message: "Access granted." });
});

module.exports = router;
