const Student = require("../models/Student");
const User = require("../models/User");

// Add Student
const addStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      address,
      className,
      section,
      parentName,
      parentPhone,
    } = req.body;

    if (
      !studentId ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !className ||
      !section ||
      !parentName ||
      !parentPhone
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [{ studentId }, { email }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student ID or email already exists",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      phone,
      address,
      className,
      section,
      parentName,
      parentPhone,
    });

    res.status(201).json({
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Students
const getStudents = async (req, res) => {
  try {
    const {
      search = "",
      className = "",
      section = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by name, student ID, or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by class
    if (className) {
      query.className = className;
    }

    // Filter by section
    if (section) {
      query.section = section;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalStudents = await Student.countDocuments(query);

    // Check which students already have login accounts
    const studentIds = students.map((student) => student._id);

    const accounts = await User.find({
      student: { $in: studentIds },
      role: "student",
    }).select("student");

    const accountStudentIds = new Set(
      accounts.map((account) => account.student.toString())
    );

    const studentsWithAccountStatus = students.map((student) => ({
      ...student.toObject(),
      hasAccount: accountStudentIds.has(student._id.toString()),
    }));

    res.status(200).json({
      students: studentsWithAccountStatus,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(
          totalStudents / Number(limit)
        ),
        totalStudents,
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Single Student
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Student
const updateStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      address,
      className,
      section,
      parentName,
      parentPhone,
    } = req.body;

    if (
      !studentId ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !className ||
      !section ||
      !parentName ||
      !parentPhone
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check duplicate Student ID or email
    const existingStudent = await Student.findOne({
      $or: [{ studentId }, { email }],
      _id: { $ne: req.params.id },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student ID or email already exists",
      });
    }

    // Find the student first
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check whether this student has a login account
    const linkedUser = await User.findOne({
      student: student._id,
      role: "student",
    });

    // If the email is being changed and this student has an account,
    // make sure the new email is not already used by another User
    if (
      linkedUser &&
      email.toLowerCase() !== linkedUser.email.toLowerCase()
    ) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: linkedUser._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "This email is already used by another account",
        });
      }
    }

    // Update Student
    student.studentId = studentId;
    student.name = name;
    student.email = email;
    student.phone = phone;
    student.address = address;
    student.className = className;
    student.section = section;
    student.parentName = parentName;
    student.parentPhone = parentPhone;

    await student.save();

    // Keep linked login account synchronized
    if (linkedUser) {
      linkedUser.email = email.toLowerCase();
      linkedUser.name = name;

      await linkedUser.save();
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};