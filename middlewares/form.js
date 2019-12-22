const formidable = require("formidable");

exports.formidableForm = async (req, res, next) => {
  // Initialize formidable form
  // This is used if there are files in the request
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 1,
        msg: "Could not upload image."
      });
    }

    req.body = { err, fields, files };
    next();
  })
}