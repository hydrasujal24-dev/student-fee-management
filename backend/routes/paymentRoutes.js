const express = require("express");
const paymentValidation = require("../middleware/paymentValidation");
const validate = require("../middleware/validationMiddleware");

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

// Record a payment
router.post(
  "/",
  protect,
  adminOnly,
  paymentValidation,
  validate,
  addPayment
);

// Get all payments
router.get(
  "/",
  protect,
  adminOnly,
  getAllPayments
);

// Get payment history for a student
router.get(
  "/student/:studentId",
  protect,
  adminOnly,
  getStudentPayments
);

module.exports = router;