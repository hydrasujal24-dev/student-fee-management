const Payment = require("../models/Payment");
const crypto = require("crypto");
const Student = require("../models/Student");
const Fee = require("../models/Fee");

// Generate receipt number
const generateReceiptNumber = () => {
  const uniquePart = crypto.randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();

  return `REC-${uniquePart}`;
};

// Add Payment
const addPayment = async (req, res) => {
  try {
    const {
      student,
      amount,
      feeType,
      paymentMethod,
      paymentDate,
      remarks,
    } = req.body;

    if (!student || !amount || !feeType) {
      return res.status(400).json({
        message: "Student, amount and fee type are required",
      });
    }

    // Check student
    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check fee structure
    const fee = await Fee.findOne({ student });

    if (!fee) {
      return res.status(404).json({
        message: "Fee structure not found for this student",
      });
    }

    // Calculate total already paid
    const previousPayments = await Payment.find({ student });

    const totalPaid = previousPayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const outstanding = fee.totalFee - totalPaid;

    // Prevent overpayment
    if (amount > outstanding) {
      return res.status(400).json({
        message: `Payment exceeds outstanding balance of Rs. ${outstanding}`,
      });
    }

    const receiptNumber = await generateReceiptNumber();

    const payment = await Payment.create({
      student,
      amount,
      feeType,
      paymentMethod,
      paymentDate,
      remarks,
      receiptNumber,
    });

    const newTotalPaid = totalPaid + amount;
    const newOutstanding = fee.totalFee - newTotalPaid;

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
      summary: {
        totalFee: fee.totalFee,
        totalPaid: newTotalPaid,
        outstanding: newOutstanding,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Student Payment History
const getStudentPayments = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const payments = await Payment.find({
      student: req.params.studentId,
    }).sort({ paymentDate: -1 });

    const fee = await Fee.findOne({
      student: req.params.studentId,
    });

    const totalPaid = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const outstanding = fee
      ? fee.totalFee - totalPaid
      : 0;

    res.status(200).json({
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
      },

      summary: {
        totalFee: fee ? fee.totalFee : 0,
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

// Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const {
      search = "",
      feeType = "",
      paymentMethod = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search student first
    if (search) {
      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          {
            studentId: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }).select("_id");

      query.student = {
        $in: students.map((student) => student._id),
      };
    }

    if (feeType) {
      query.feeType = feeType;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const payments = await Payment.find(query)
      .populate(
        "student",
        "studentId name className section"
      )
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalPayments = await Payment.countDocuments(
      query
    );

    const allMatchingPayments = await Payment.find(
      query
    ).select("amount");

    const totalCollection = allMatchingPayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    res.status(200).json({
      payments,

      totalCollection,

      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(
          totalPayments / Number(limit)
        ),
        totalPayments,
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

module.exports = {
  addPayment,
  getStudentPayments,
  getAllPayments,
};