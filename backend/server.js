const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const receiptRoutes = require("./routes/receiptRoutes");


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/student",require("./routes/studentDashboardRoutes"));
app.use("/api/admin/dashboard",require("./routes/adminDashboardRoutes"));
app.get("/", (req, res) => {
  res.json({
    message: "Student Fee Management API is running",
  });
});
app.use(
  "/api/receipts",
  require("./routes/receiptRoutes")
);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});