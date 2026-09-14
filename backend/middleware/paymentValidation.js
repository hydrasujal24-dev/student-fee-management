const { body } = require("express-validator");

const paymentValidation = [
  body("student")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required"),

  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Payment amount must be greater than 0"),

  body("feeType")
    .isIn(["Tuition", "Transport", "Exam", "Other"])
    .withMessage("Invalid fee type"),

  body("paymentMethod")
    .optional()
    .isIn(["Cash", "Bank", "Cheque"])
    .withMessage("Invalid payment method"),

  body("remarks")
    .optional()
    .trim(),
];

module.exports = paymentValidation;