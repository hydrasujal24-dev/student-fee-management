const { body } = require("express-validator");

const studentValidation = [
  body("studentId")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Student name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("className")
    .trim()
    .notEmpty()
    .withMessage("Class is required"),

  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required"),

  body("parentName")
    .trim()
    .notEmpty()
    .withMessage("Parent name is required"),

  body("parentPhone")
    .trim()
    .notEmpty()
    .withMessage("Parent phone is required"),
];

module.exports = studentValidation;