const express = require('express');

const authMiddleware = require('../middleware/auth');

const razorpayController = require('../controllers/razorpay');

const router = express.Router();

router.get('/', authMiddleware, razorpayController.getOrderInfo);
router.post(
  '/update',
  authMiddleware,
  razorpayController.postTransactionStatus
);

module.exports = router;
