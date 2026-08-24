const express = require("express");

const {
  addPayment,
  getStudentPayments,
  getAllPayments,
} = require("../controllers/paymentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Record payment
router.post("/", protect, adminOnly, addPayment);

// Get all payments
router.get("/", protect, adminOnly, getAllPayments);

// Get payment history for student
router.get(
  "/student/:studentId",
  protect,
  adminOnly,
  getStudentPayments
);

module.exports = router;