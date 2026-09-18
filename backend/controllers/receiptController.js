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

    if (!payment.student) {
  return res.status(400).json({
    message: "Payment is not linked to a student",
  });
}

    // Student can only access their own receipt
if (req.user.role === "student") {
  const user = await User.findById(req.user.id);

  if (!user || !user.student) {
    return res.status(403).json({
      message: "Student account is not linked to a student profile",
    });
  }

  if (
    !payment.student ||
    user.student.toString() !== payment.student._id.toString()
  ) {
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

    const paymentDate = new Date(
      payment.paymentDate
    ).toLocaleDateString();

    const formatAmount = (amount) =>
      `Rs. ${amount.toLocaleString()}`;

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

    // =========================
    // HEADER
    // =========================

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("ITAHARI INTERNATIONAL COLLEGE", {
        align: "center",
      });

    doc
      .moveDown(0.4)
      .fontSize(15)
      .font("Helvetica")
      .text("PAYMENT RECEIPT", {
        align: "center",
      });

    doc.moveDown(1);

    // Header line
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1);

    // =========================
    // RECEIPT DETAILS
    // =========================

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Receipt Number:", 50, doc.y, {
        continued: true,
      });

    doc
      .font("Helvetica")
      .text(` ${payment.receiptNumber}`);

    doc
      .font("Helvetica-Bold")
      .text("Payment Date:", 50, doc.y, {
        continued: true,
      });

    doc
      .font("Helvetica")
      .text(` ${paymentDate}`);

    doc.moveDown(1.2);

    // =========================
    // STUDENT INFORMATION
    // =========================

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Student Information");

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Student ID: ${payment.student.studentId}`
      );

    doc.text(
      `Name: ${payment.student.name}`
    );

    doc.text(
      `Class: ${payment.student.className || "-"}  |  Section: ${
        payment.student.section || "-"
      }`
    );

    doc.text(
      `Email: ${payment.student.email || "-"}`
    );

    if (payment.student.phone) {
      doc.text(
        `Phone: ${payment.student.phone}`
      );
    }

    doc.moveDown(1.2);

    // =========================
    // PAYMENT INFORMATION
    // =========================

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Payment Information");

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Fee Type: ${payment.feeType}`
      );

    doc.text(
      `Payment Method: ${payment.paymentMethod}`
    );

    doc.text(
      `Amount Paid: ${formatAmount(payment.amount)}`
    );

    if (payment.remarks) {
      doc.text(
        `Remarks: ${payment.remarks}`
      );
    }

    doc.moveDown(1.2);

    // =========================
    // FEE SUMMARY
    // =========================

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Fee Summary");

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Total Fee: ${formatAmount(totalFee)}`
      );

    doc.text(
      `Total Paid: ${formatAmount(totalPaid)}`
    );

    doc
      .font("Helvetica-Bold")
      .text(
        `Outstanding Balance: ${formatAmount(outstanding)}`
      );

    doc.moveDown(2);

    // =========================
    // PAYMENT STATUS
    // =========================

    const status =
      outstanding === 0
        ? "PAID IN FULL"
        : "PARTIALLY PAID";

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Payment Status: ${status}`, {
        align: "center",
      });

    doc.moveDown(3);

    // =========================
    // FOOTER
    // =========================

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1);

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        "This is a computer-generated payment receipt.",
        {
          align: "center",
        }
      );

    doc
      .moveDown(0.3)
      .text("Thank you.", {
        align: "center",
      });

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