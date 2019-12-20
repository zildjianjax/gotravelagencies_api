const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/auth");
const { requireSignin, authMiddleware } = require("../middlewares/auth");

// Validators
const { runValidation } = require("../validators");
const { signUpValidator, signInValidator } = require("../validators/auth");

router.post("/signup", signUpValidator, runValidation, signup);
router.post("/signin", signInValidator, runValidation, signin);
router.get("/signout", signout);
// test
router.get("/secret", requireSignin, authMiddleware, (req, res) => {
  res.json({ message: "Access granted." });
});

module.exports = router;
