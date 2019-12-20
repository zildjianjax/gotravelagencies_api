const Category = require("../models/category");
const slugify = require("slugify")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase()
    const category = new Category({ name, slug });

    await category.save();

    return res.json({ success: 1, data: category });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.json({ success: 1, data: categories });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}

exports.read = async (req, res) => {
  try {
    const slug = req.params.slug
    const category = await Category.findOne({ slug });

    if(!category) {
      return res.status(404).json({ error: 1, msg: "Category not found"});
    }

    return res.json({ success: 1, data: category });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}

exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug
    await Category.findOneAndRemove({ slug });

    return res.json({ success: 1, msg: 'Category deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}