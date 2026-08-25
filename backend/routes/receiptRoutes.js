const express = require("express");

const {
  generateReceipt,
} = require("../controllers/receiptController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/:paymentId",
  protect,
  generateReceipt
);

module.exports = router;