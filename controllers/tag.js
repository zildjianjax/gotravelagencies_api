const Tag = require("../models/tag");
const slugify = require("slugify")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name).toLowerCase()
    const tag = new Tag({ name, slug });

    await tag.save();

    return res.json({ success: 1, data: tag });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
};

exports.list = async (req, res) => {
  try {
    const tags = await Tag.find();

    return res.json({ success: 1, data: tags });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}

exports.read = async (req, res) => {
  try {
    const slug = req.params.slug
    const tag = await Tag.findOne({ slug });
    
    if(!tag) {
      return res.status(404).json({ error: 1, msg: "Tag not found"});
    }

    return res.json({ success: 1, data: tag });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}

exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug
    await Tag.findOneAndRemove({ slug });

    return res.json({ success: 1, msg: 'Tag deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: 1, msg: errorHandler(err)});
  }
}