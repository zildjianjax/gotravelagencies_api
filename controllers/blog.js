const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const formidable = require("formidable");
const stripHtml = require("string-strip-html");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { smartTrim } = require("../helpers/blog");

exports.create = async (req, res) => {
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
    const { title, body, categories, tags } = fields;
    const arrayOfCategories = categories && categories.split(",");
    const arrayOfTags = tags && tags.split(",");

    // field validation
    let error = false;
    if (!error && (!title || !title.length)) {
      error = "Title is required.";
    }
    if (!error && (!body || body.length < 160)) {
      error = "Body should be at least 160 characters.";
    }
    if (!error && (!arrayOfCategories || arrayOfCategories.length == 0)) {
      error = "Must have at least 1 category";
    }
    if (!error && (!arrayOfTags || arrayOfTags.length == 0)) {
      error = "Must have at least 1 tag";
    }
    if (error) {
      return res.status(400).json({
        error: 1,
        msg: error
      });
    }

    // blog creation
    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(stripHtml(body), 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME || ""}`;
    blog.mdesc = stripHtml(body.substring(0, 160));
    blog.postedBy = req.user._id;

    // photo logic
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 1,
          msg: "Image should be less than 1mb in size."
        });
      }

      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    // Saving the blog to database
    try {
      await blog.save();

      // Adding categories to the blog object
      const blogWithTagsAndCategories = await Blog.findByIdAndUpdate(
        blog._id,
        {
          $push: {
            categories: arrayOfCategories,
            tags: arrayOfTags
          }
        },
        { new: true }
      );
      res.json({ success: 1, data: blogWithTagsAndCategories });
    } catch (err) {
      return res.status(400).json({
        error: 1,
        msg: errorHandler(err)
      });
    }
  });
};

// list, listWithCategoriesAndTags, read, remove, update
exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({ createdAt: -1})
      .select("-body -photo -mtitle -mdesc -__v");
    return res.json({ success: 1, data: blogs });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
exports.listWithCategoriesAndTags = async (req, res) => {
  const limit = req.body.limit ? req.body.limit : 10;
  const skip = req.body.skip ? req.body.skip : 0;
  try {
    const blogs = await Blog.find()
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-body -photo -mtitle -mdesc -__v");
    const categories = await Category.find();
    const tags = await Tag.find();
    return res.json({
      success: 1,
      data: {
        blogs,
        categories,
        tags,
        size: blogs.length
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .select("-__v -excerpt -photo");
    return res.json({ success: 1, data: blog });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOneAndRemove({ slug });

    return res.json({ success: 1, msg: "Blog deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};
exports.update = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    let oldBlog = await Blog.findOne({ slug });

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
      const slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { title, body, categories, tags } = fields;
      if (title) {
        oldBlog.mtitle = `${title} | ${process.env.APP_NAME || ""}`;
      }
      if (body) {
        oldBlog.excerpt = smartTrim(stripHtml(body), 320, " ", " ...");
        oldBlog.mdesc = stripHtml(body.substring(0, 160));
      }
      if(categories) {
        oldBlog.categories = categories.split(",")
      }
      if(tags) {
        oldBlog.tags = tags.split(",")
      }

      // photo logic
      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: 1,
            msg: "Image should be less than 1mb in size."
          });
        }

        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      }

      // Saving the blog to database
      await oldBlog.save();
      oldBlog.photo = undefined
      res.json({ success: 1, data: oldBlog });
    });
  } catch (err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
};

exports.photo = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug }).select('photo');
    res.set('Content-Type', blog.photo.contentType)
    res.send(blog.photo.data)
  } catch(err) {
    return res.status(400).json({
      error: 1,
      msg: errorHandler(err)
    });
  }
}