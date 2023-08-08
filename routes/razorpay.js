const express = require('express');

const authMiddleware = require('../middleware/auth');

const razorpayController = require('../controllers/razorpay');

const router = express.Router();

// GET => / => INITIATE RAZORPAY ORDER INSTANCE AND GET ORDER INFO
router.get('/', authMiddleware, razorpayController.getOrderInfo);

// POST => /update => UPDATE ORDER TABLE & USER TABLE
router.post(
  '/update',
  authMiddleware,
  razorpayController.postTransactionStatus
);

module.exports = router;
