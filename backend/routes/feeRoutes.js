const express = require("express");

const {
  createFee,
  getStudentFee,
  updateFee,
  getAllFees,
} = require("../controllers/feeController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create fee structure
router.post("/", protect, adminOnly, createFee);

// Get all fee structures
router.get("/", protect, adminOnly, getAllFees);

// Get fee for a student
router.get(
  "/student/:studentId",
  protect,
  adminOnly,
  getStudentFee
);

// Update fee structure
router.put(
  "/student/:studentId",
  protect,
  adminOnly,
  updateFee
);

module.exports = router;