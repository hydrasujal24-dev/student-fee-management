const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getAdminDashboard
);

module.exports = router;