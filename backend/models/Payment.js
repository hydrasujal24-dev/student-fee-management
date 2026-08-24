const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    feeType: {
      type: String,
      enum: ["Tuition", "Transport", "Exam", "Other"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "Cheque"],
      default: "Cash",
    },

    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);