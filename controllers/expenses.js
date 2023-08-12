const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../utils/database');

// GET => /expense/?page=<value> & pageSize=<value> => GET ALL EXPENSES
exports.getExpenses = async (req, res, next) => {
  const page = Number(req.query.page) || 1; // Current page number
  const pageSize = Number(req.query.pageSize) || 5; // Rows per page
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalNumberOfExpenses = await req.user.countExpenses();
    const expense = await req.user.getExpenses({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({
      count: totalNumberOfExpenses,
      data: expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// POST => /expense/ => CREATE AN EXPENSE
exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;

  try {
    const expense = await req.user.createExpense(
      {
        price: price,
        description: description,
        category: category,
      },
      { transaction: t }
    );

    // updating total expense of user table
    const updatedTotalExpense = req.user.totalExpense + Number(price);
    await req.user.update(
      { totalExpense: updatedTotalExpense },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: 'Expense added successfully.',
      data: expense,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// POST => /expense/delete/<id> => DELETE AN EXPENSE
exports.postDeleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  const id = req.params.id;

  try {
    const expense = await Expense.findByPk(id);
    const previousPrice = expense.price;
    await expense.destroy({ transaction: t });

    // updating total expense of user table
    const updatedTotalExpense = req.user.totalExpense - Number(previousPrice);
    await req.user.update(
      { totalExpense: updatedTotalExpense },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      message: 'Expense deleted successfully.',
      data: {},
    });
  } catch (error) {
    await t.rollback();
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST => /expense/edit => EDIT AN EXPENSE
exports.postEditExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  const id = req.body.id;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;

  try {
    const expense = await Expense.findByPk(id);
    const previousPrice = expense.price;

    expense.price = price;
    expense.description = description;
    expense.category = category;

    const updatedExpense = await expense.save({ transaction: t });

    // updating total expense of user table
    const updatedTotalExpense =
      req.user.totalExpense - Number(previousPrice) + Number(price);
    await req.user.update(
      { totalExpense: updatedTotalExpense },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      message: 'Expense updated successfully.',
      data: updatedExpense,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET => /expense/leaderboard => GET THE LEADER-BOARD
exports.getLeaderboard = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        message: 'The user does not have permission to perform this action.',
      });
    }
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpense'],
      order: [['totalExpense', 'DESC']],
    });

    res.status(200).json({
      data: leaderboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
