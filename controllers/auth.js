const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");

/**
 * @api {post} /signup Register
 * @apiName PostSignUp
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} [name] Name of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 * 
 * @apiSuccess {Number} success Successful response.
 * @apiSuccess {String} msg Response message.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": 1,
 *       "msg": "Signup success! Please log in."
 *     }
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 1, msg: "Email already taken!" });
    }
    const username = shortId.generate();
    const profile = `${process.env.CLIENT_URL}/profile/${username}`;

    const newUser = new User({ name, email, password, username, profile });
    await newUser.save();

    return res.json({ success: 1, msg: "Signup success! Please log in." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @api {post} /signin Sign In
 * @apiName PostSignIn
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 * 
 * @apiSuccess {String} token Token of user generated from JWT.
 * @apiSuccess {Object} user User object.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": 1,
 *       "user": {
 *          "_id": "123456sadasd",
 *          "name": John Doe
 *        }
 *     }
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if there's a user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 1, msg: "User not found. Please signup." });
    }
    // authenticate
    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(400).json({  error: 1, msg: "Invalid credentials." });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.cookie("token", token, { expiresIn: "1d" });
    let { _id, name, username, role } = user;
    res.json({
      token,
      user: { _id, name, username, role }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success"
  });
};