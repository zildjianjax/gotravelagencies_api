const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../middlewares/auth");
const {
  create,
  list,
  listWithCategoriesAndTags,
  read,
  remove,
  update,
  photo
} = require("../controllers/blog");

router.post("/", requireSignin, adminMiddleware, create);
router.get("/", list);
router.post("/with-categories-and-tags", listWithCategoriesAndTags);
router.get("/:slug", read);
router.delete("/:slug", requireSignin, adminMiddleware, remove);
router.put("/:slug", requireSignin, adminMiddleware, update);
router.get("/:slug/photo", photo);

module.exports = router;
