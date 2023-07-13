const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../utils/database');

// GET => / => GET ALL EXPENSES
exports.getExpenses = async (req, res, next) => {
  try {
    const expense = await req.user.getExpenses();
    // console.log(expense);
    res.status(200).json({
      success: true,
      count: expense.length,
      data: expense,
      userIsPremium: req.user.isPremium,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// POST => / => CREATE AN EXPENSE
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
    console.log('Record Added');
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// POST => /delete/<id> => DELETE AN EXPENSE
exports.postDeleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  const id = req.params.id;

  try {
    const expense = await Expense.findByPk(id);
    const previousPrice = expense.price;
    const result = await expense.destroy({ transaction: t });

    // updating total expense of user table
    const updatedTotalExpense = req.user.totalExpense - Number(previousPrice);
    await req.user.update(
      { totalExpense: updatedTotalExpense },
      { transaction: t }
    );

    await t.commit();
    console.log('Record Deleted');
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// POST => /edit => EDIT AN EXPENSE
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
    console.log('Record Updated');
    res.status(200).json({ success: true, data: updatedExpense });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// GET => /leaderboard => GET THE LEADER-BOARD
exports.getLeaderboard = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        error: 'the user does not have permission to perform this action',
      });
    }
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpense'],
      order: [['totalExpense', 'DESC']],
    });

    // console.log(leaderboard);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
