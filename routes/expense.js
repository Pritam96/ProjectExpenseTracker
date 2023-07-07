const express = require('express');

const expenseController = require('../controllers/expenses');

const router = express.Router();

// GET => GET ALL EXPENSES
router.get('/', expenseController.getExpenses);

// POST => CREATE AN EXPENSE
router.post('/', expenseController.postAddExpense);

// POST => DELETE AN EXPENSE
router.post('/delete/:id', expenseController.postDeleteExpense);

// POST => EDIT AN EXPENSE
router.post('/edit', expenseController.postEditExpense);

module.exports = router;
