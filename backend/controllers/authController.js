const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// Register Student User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if login account already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Find matching student profile
    const student = await Student.findOne({
      email: normalizedEmail,
    });

    if (!student) {
      return res.status(404).json({
        message: "No student profile found with this email",
      });
    }

    // Prevent same student from having multiple accounts
    const existingStudentAccount = await User.findOne({
      student: student._id,
    });

    if (existingStudentAccount) {
      return res.status(400).json({
        message: "This student already has a login account",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      student: student._id,
    });

    res.status(201).json({
      message: "Student account registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student: user.student,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Create Student Login Account
const createStudentAccount = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        message: "Student ID and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check if this student is already linked to an account
    const existingStudentAccount = await User.findOne({
      student: student._id,
    });

    if (existingStudentAccount) {
      return res.status(400).json({
        message: "This student already has a login account",
      });
    }

    // Check whether the student's email already has a User account
    const existingUser = await User.findOne({
      email: student.email,
    });

    if (existingUser) {
      // Only allow linking an existing student account
      if (existingUser.role !== "student") {
        return res.status(400).json({
          message: "This email belongs to an admin account",
        });
      }

      if (existingUser.student) {
        return res.status(400).json({
          message: "This account is already linked to another student",
        });
      }

      existingUser.student = student._id;

      // Only change password if a new password was provided
      existingUser.password = await bcrypt.hash(password, 10);

      await existingUser.save();

      return res.status(200).json({
        message: "Existing student account linked successfully",
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          student: existingUser.student,
        },
      });
    }

    // No existing account → create a new one
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: student.name,
      email: student.email,
      password: hashedPassword,
      role: "student",
      student: student._id,
    });

    res.status(201).json({
      message: "Student login account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student: user.student,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  createStudentAccount,
  loginUser,
};