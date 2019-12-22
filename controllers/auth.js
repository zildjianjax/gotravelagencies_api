const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandler");

const registerUser = async body => {
  try {
    const { name, email, password } = body;
    const user = await User.findOne({ email });
    if (user) {
      return { error: 1, msg: "Email already taken!" };
    }
    const username = shortId.generate();
    const profile = `${process.env.CLIENT_URL}/profile/${username}`;

    const newUser = new User({ name, email, password, username, profile });
    await newUser.save();

    return { success: 1, msg: "Registered Successfully!" };
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.registerUser = registerUser;
/**
 * @api {post} /register Register
 * @apiName PostRegister
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
exports.register = async (req, res) => {
  try {
    user = await registerUser(req.body);

    if (user.error) {
      return res.status(400).json(user);
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @api {post} /login Login
 * @apiName PostLogin
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
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZmNjYzYTU3YThkMDM0NTg3MTZmYTYiLCJpYXQiOjE1NzcwMTg5NDQsImV4cCI6MTU3NzEwNTM0NH0.nklAZL-1p63ISa0JRjAMbu7jNxS3v-0K-sjAtrlGtiI",
 *       "user": {
 *          "_id": "5dff663a57a8d03488715fa6",
 *           "name": "Jax",
 *           "username": "nzurhr1t",
 *           "role": 0
 *        }
 *     }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if there's a user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: 1, msg: "User not found. Please signup." });
    }

    // authenticate
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ error: 1, msg: "Invalid credentials." });
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
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

/**
 * @api {get} /logout Logout
 * @apiName GetLogout
 * @apiGroup Auth
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Number} success Is success response?
 * @apiSuccess {String} msg Message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": 1,
 *        "msg": "Logout success"
 *      }
 */
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    success: 1,
    msg: "Logout success"
  });
};
