const Expense = require('../models/expense');

// GET => / => GET ALL EXPENSES
exports.getExpenses = async (req, res, next) => {
  try {
    const expense = await req.user.getExpenses();
    res.json(expense);
  } catch (error) {
    console.log(error);
    res.json([]);
  }
};

// POST => / => CREATE AN EXPENSE
exports.postAddExpense = async (req, res, next) => {
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;

  try {
    const expense = await req.user.createExpense({
      price: price,
      description: description,
      category: category,
    });
    console.log('Record Added');
    res.json(expense);
  } catch (error) {
    console.log(error);
    res.json({});
  }
};

// POST => /delete/<id> => DELETE AN EXPENSE
exports.postDeleteExpense = async (req, res, next) => {
  const id = req.params.id;

  try {
    const expense = await Expense.findByPk(id);
    const result = await expense.destroy();
    console.log('Record Deleted');
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({});
  }
};

// POST => /edit => EDIT AN EXPENSE
exports.postEditExpense = async (req, res, next) => {
  const id = req.body.id;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;

  try {
    const expense = await Expense.findByPk(id);

    expense.price = price;
    expense.description = description;
    expense.category = category;

    const updatedExpense = await expense.save();

    console.log('Record Updated');
    res.json(updatedExpense);
  } catch (error) {
    console.log(error);
    res.json({});
  }
};
