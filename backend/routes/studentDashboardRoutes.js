const express = require("express");

const {
  getStudentDashboard,
} = require("../controllers/studentDashboardController");

const {
  protect,
  studentOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  studentOnly,
  getStudentDashboard
);

module.exports = router;