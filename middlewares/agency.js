const Agency = require("../models/Agency");

exports.agencyOwner = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    
    const agency = await Agency.findOne({ slug });
    
    if(agency.owner != req.user._id) {
      return res.status(400).json({
        error: 1,
        msg: "Unauthorized access to agency."
      })
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
}