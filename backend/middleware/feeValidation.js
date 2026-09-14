const { body } = require("express-validator");

const feeValidation = [
  body("student")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required"),

  body("tuitionFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tuition fee must be a positive number"),

  body("transportFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Transport fee must be a positive number"),

  body("examFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Exam fee must be a positive number"),

  body("otherFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Other fee must be a positive number"),
];

module.exports = feeValidation;