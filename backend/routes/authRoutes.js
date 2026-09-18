const express = require("express");

const {
  createStudentAccount,
  loginUser,
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  loginValidation,
} = require("../middleware/authValidation");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

router.post(
  "/create-student-account",
  protect,
  adminOnly,
  createStudentAccount
);

module.exports = router;