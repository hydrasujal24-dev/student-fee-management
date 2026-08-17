const express = require("express");

const {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, addStudent);

router.get("/", protect, adminOnly, getStudents);

router.get("/:id", protect, adminOnly, getStudent);

router.put("/:id", protect, adminOnly, updateStudent);

router.delete("/:id", protect, adminOnly, deleteStudent);

module.exports = router;