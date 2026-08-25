const PDFDocument = require("pdfkit");
const Payment = require("../models/Payment");
const Fee = require("../models/Fee");
const Student = require("../models/Student");
const User = require("../models/User");

const generateReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(
      req.params.paymentId
    ).populate(
      "student",
      "studentId name email phone address className section parentName"
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Student can only access their own receipt
    if (req.user.role === "student") {
      const user = await User.findById(req.user.id);

      if (!user || user.email !== payment.student.email) {
        return res.status(403).json({
          message: "You can only access your own receipt",
        });
      }
    }

    const fee = await Fee.findOne({
      student: payment.student._id,
    });

    const payments = await Payment.find({
      student: payment.student._id,
    });

    const totalPaid = payments.reduce(
      (total, item) => total + item.amount,
      0
    );

    const totalFee = fee ? fee.totalFee : 0;

    const outstanding = Math.max(
      totalFee - totalPaid,
      0
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${payment.receiptNumber}.pdf"`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    doc.pipe(res);

    // Header
    doc
      .fontSize(22)
      .text("STUDENT FEE MANAGEMENT SYSTEM", {
        align: "center",
      });

    doc
      .moveDown()
      .fontSize(18)
      .text("PAYMENT RECEIPT", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(11)
      .text(`Receipt Number: ${payment.receiptNumber}`);

    doc.text(
      `Payment Date: ${new Date(
        payment.paymentDate
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    // Student information
    doc.fontSize(14).text("Student Information");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Student ID: ${payment.student.studentId}`);

    doc.text(`Name: ${payment.student.name}`);

    doc.text(
      `Class: ${payment.student.className} - Section ${payment.student.section}`
    );

    doc.text(`Email: ${payment.student.email}`);

    doc.moveDown();

    // Payment information
    doc.fontSize(14).text("Payment Information");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Fee Type: ${payment.feeType}`);

    doc.text(
      `Payment Method: ${payment.paymentMethod}`
    );

    doc.text(
      `Amount Paid: Rs. ${payment.amount.toLocaleString()}`
    );

    if (payment.remarks) {
      doc.text(`Remarks: ${payment.remarks}`);
    }

    doc.moveDown();

    // Balance
    doc.fontSize(14).text("Fee Summary");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(
        `Total Fee: Rs. ${totalFee.toLocaleString()}`
      );

    doc.text(
      `Total Paid: Rs. ${totalPaid.toLocaleString()}`
    );

    doc.text(
      `Outstanding Balance: Rs. ${outstanding.toLocaleString()}`
    );

    doc.moveDown(3);

    doc
      .fontSize(10)
      .text(
        "This is a computer-generated payment receipt.",
        {
          align: "center",
        }
      );

    doc.text(
      "Thank you.",
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    console.error("Receipt Error:", error);

    res.status(500).json({
      message: "Failed to generate receipt",
      error: error.message,
    });
  }
};

module.exports = {
  generateReceipt,
};