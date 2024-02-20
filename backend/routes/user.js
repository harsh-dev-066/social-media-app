const express = require("express");
const {
  getUserController,
  updateUserController,
  folowUserController,
  unfolowUserController,
  blockUserController,
  unblockUserController,
  getBlockListController,
  deleteUserController,
  searchUserController,
  uploadProfilePictureController,
  uploadCoverPictureController,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

// GET USER
router.get("/:userId", getUserController);

// UPDATE USER
router.put("/update/:userId", updateUserController);

// FOLLOW USER
router.post("/follow/:userId", folowUserController);

// UNFLLOW USER
router.post("/unfollow/:userId", unfolowUserController);

// BLOCK USER
router.post("/block/:userId", blockUserController);

// UNBLOCK USER
router.post("/unblock/:userId", unblockUserController);

// GET BLOCKLIST
router.get("/blocklist/:userId", getBlockListController);

// DELETE USER
router.delete("/delete/:userId", deleteUserController);

// SEARCH USER
router.get("/search/:query", searchUserController);

//UPDATE PROFILE PICTURE
router.put(
  "/update-profile-picture/:userId",
  upload.single("profilePicture"),
  uploadProfilePictureController
);

//UPDATE COVER PICTURE
router.put(
  "/update-cover-picture/:userId",
  upload.single("coverPicture"),
  uploadCoverPictureController
);

module.exports = router;
