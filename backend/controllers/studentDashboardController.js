const User = require("../models/User");
const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");

// Get logged-in student's dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("student");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.student) {
      return res.status(404).json({
        message: "Student profile is not linked to this account",
      });
    }

    const student = user.student;

    const fee = await Fee.findOne({
      student: student._id,
    });

    if (!fee) {
      return res.status(404).json({
        message: "Fee structure not found",
      });
    }

    const payments = await Payment.find({
      student: student._id,
    }).sort({ paymentDate: -1 });

    const totalPaid = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const outstanding = Math.max(fee.totalFee - totalPaid, 0);

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
        totalFee: fee.totalFee,
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
  getStudentDashboard,
};