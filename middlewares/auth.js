const User = require("../models/user");
const expressJwt = require("express-jwt");

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

exports.authMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-hashed_password')
    if(!user) {
      return res.status(400).json({
        error: 1,
        msg: "User not found!"
      })
    }
    req.profile = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
}

exports.adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-hashed_password')
    if(!user) {
      return res.status(400).json({
        error: 1,
        msg: "User not found!"
      })
    }
    if(user.role !== 1) {
      return res.status(401).json({
        error: 1,
        msg: "Access denied."
      })
    }
    req.profile = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
}