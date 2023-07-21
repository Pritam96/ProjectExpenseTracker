const express = require('express');

const reportController = require('../controllers/reports');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get(
  '/dailyReport/:date',
  authMiddleware,
  reportController.getDailyReport
);
router.get(
  '/monthlyReport/:yearMonth',
  authMiddleware,
  reportController.getMonthlyReport
);

router.get('/download', authMiddleware, reportController.getDownloadReport);

module.exports = router;
