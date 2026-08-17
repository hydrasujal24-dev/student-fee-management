const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    tuitionFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    transportFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    examFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    otherFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total fee automatically
feeSchema.pre("save", function () {
  this.totalFee =
    this.tuitionFee +
    this.transportFee +
    this.examFee +
    this.otherFee;
});

module.exports = mongoose.model("Fee", feeSchema);