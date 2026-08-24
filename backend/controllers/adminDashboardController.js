const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");

// Get Admin Dashboard Statistics
const getAdminDashboard = async (req, res) => {
  try {
    // Total students
    const totalStudents = await Student.countDocuments();

    // Get all fee structures
    const fees = await Fee.find();

    // Calculate total fees
    const totalFee = fees.reduce(
      (total, fee) => total + fee.totalFee,
      0
    );

    // Get all payments
    const payments = await Payment.find();

    // Calculate total collection
    const totalCollection = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    // Calculate pending amount
    const totalPending = Math.max(
      totalFee - totalCollection,
      0
    );

    // Today's date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's payments
    const todayPayments = await Payment.find({
      paymentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const todayCollection = todayPayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    // Recent payments
    const recentPayments = await Payment.find()
      .populate(
        "student",
        "studentId name className section"
      )
      .sort({ paymentDate: -1 })
      .limit(5);

    res.status(200).json({
      statistics: {
        totalStudents,
        totalFee,
        totalCollection,
        totalPending,
        todayCollection,
      },

      recentPayments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};