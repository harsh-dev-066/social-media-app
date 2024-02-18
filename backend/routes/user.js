const express = require("express");
const {
  getUserController,
  updateUserController,
} = require("../controllers/userController");

const router = express.Router();

// GET USER
router.get("/:userId", getUserController);

// UPDATE USER
router.put("/update/:userId", updateUserController);

module.exports = router;
