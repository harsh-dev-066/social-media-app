const express = require("express");
const {
  createPostController,
  updatePostController,
  getPostsController,
  getUserPostsController,
  deletePostController,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

// CREATE POST
router.post("/create/:userId", upload.array("images", 5), createPostController);

// UPDATE POST
router.put("/update/:postId", updatePostController);

// GET ALL POSTS
router.get("/all/:userId", getPostsController);

// GET USER POSTS
router.get("/user/:userId", getUserPostsController);

// DELETE POST
router.delete("/delete/:postId", deletePostController);

module.exports = router;
