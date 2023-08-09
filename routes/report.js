const express = require('express');

const reportController = require('../controllers/reports');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET => /dailyReport/?startDate=<date>&endDate=<date> => GET EXPENSES BY DATE
router.get('/dailyReport', authMiddleware, reportController.getDailyReport);

// GET => /monthlyReport/<month> => GET EXPENSES BY MONTH
router.get(
  '/monthlyReport/:yearMonth',
  authMiddleware,
  reportController.getMonthlyReport
);

// GET => /download => GET DOWNLOAD ALL EXPENSES
router.get('/download', authMiddleware, reportController.getDownloadReport);

module.exports = router;
