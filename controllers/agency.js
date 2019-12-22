const Agency = require("../models/Agency");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.all = (req, res) => {
  res.send("Agency API");
};

exports.create = async (req, res) => {
  res.json(req.body)
};
