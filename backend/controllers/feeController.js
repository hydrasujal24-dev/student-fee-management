const Fee = require("../models/Fee");
const Student = require("../models/Student");

// Create Fee Structure
const createFee = async (req, res) => {
  try {
    const {
      student,
      tuitionFee = 0,
      transportFee = 0,
      examFee = 0,
      otherFee = 0,
    } = req.body;

    if (!student) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const existingFee = await Fee.findOne({ student });

    if (existingFee) {
      return res.status(400).json({
        message: "Fee structure already exists for this student",
      });
    }

    const fee = await Fee.create({
      student,
      tuitionFee,
      transportFee,
      examFee,
      otherFee,
    });

    res.status(201).json({
      message: "Fee structure created successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Fee for Student
const getStudentFee = async (req, res) => {
  try {
    const fee = await Fee.findOne({
      student: req.params.studentId,
    }).populate("student", "studentId name email className section");

    if (!fee) {
      return res.status(404).json({
        message: "Fee structure not found",
      });
    }

    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Fee Structure
const updateFee = async (req, res) => {
  try {
    const {
      tuitionFee,
      transportFee,
      examFee,
      otherFee,
    } = req.body;

    const fee = await Fee.findOne({
      student: req.params.studentId,
    });

    if (!fee) {
      return res.status(404).json({
        message: "Fee structure not found",
      });
    }

    if (tuitionFee !== undefined) {
      fee.tuitionFee = tuitionFee;
    }

    if (transportFee !== undefined) {
      fee.transportFee = transportFee;
    }

    if (examFee !== undefined) {
      fee.examFee = examFee;
    }

    if (otherFee !== undefined) {
      fee.otherFee = otherFee;
    }

    await fee.save();

    res.status(200).json({
      message: "Fee structure updated successfully",
      fee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Fee Structures
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate(
        "student",
        "studentId name email className section"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createFee,
  getStudentFee,
  updateFee,
  getAllFees,
};