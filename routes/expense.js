const express = require('express');

const expenseController = require('../controllers/expenses');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET => GET ALL EXPENSES
router.get('/', authMiddleware, expenseController.getExpenses);

// POST => CREATE AN EXPENSE
router.post('/', authMiddleware, expenseController.postAddExpense);

// POST => DELETE AN EXPENSE
router.delete(
  '/delete/:id',
  authMiddleware,
  expenseController.postDeleteExpense
);

// POST => EDIT AN EXPENSE
router.post('/edit', authMiddleware, expenseController.postEditExpense);

module.exports = router;
