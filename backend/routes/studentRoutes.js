const express = require("express");
const studentValidation = require("../middleware/studentValidation");
const validate = require("../middleware/validationMiddleware");

const {
  addStudent,
  getStudents,
  getStudent,
  getStudentDetails,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  studentValidation,
  validate,
  addStudent
);

router.get("/", protect, adminOnly, getStudents);

router.get(
  "/:id/details",
  protect,
  adminOnly,
  getStudentDetails
);


router.get("/:id", protect, adminOnly, getStudent);

router.put("/:id", protect, adminOnly, updateStudent);

router.delete("/:id", protect, adminOnly, deleteStudent);

router.get(
  "/:id/details",
  protect,
  adminOnly,
  getStudentDetails
);

module.exports = router;