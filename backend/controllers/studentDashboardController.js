const User = require("../models/User");
const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");

// Get logged-in student's dashboard
const getMyDashboard = async (req, res) => {
  try {
    // Find the user who is logged in
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find student profile using the same email
    const student = await Student.findOne({
      email: user.email,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Find fee structure
    const fee = await Fee.findOne({
      student: student._id,
    });

    // Find payments
    const payments = await Payment.find({
      student: student._id,
    }).sort({ paymentDate: -1 });

    // Calculate total paid
    const totalPaid = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const totalFee = fee ? fee.totalFee : 0;

    const outstanding = Math.max(
      totalFee - totalPaid,
      0
    );

    res.status(200).json({
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        className: student.className,
        section: student.section,
      },

      feeSummary: {
        totalFee,
        totalPaid,
        outstanding,
      },

      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMyDashboard,
};