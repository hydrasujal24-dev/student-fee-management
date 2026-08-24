const express = require("express");

const {
  getMyDashboard,
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
  getMyDashboard
);

module.exports = router;