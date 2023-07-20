const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

exports.getDailyReport = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        success: false,
        error: 'the user does not have permission to perform this action',
      });
    }
    const date = req.params.date;
    const expenses = await req.user.getExpenses({
      where: sequelize.where(
        sequelize.fn('date', sequelize.col('createdAt')),
        '=',
        date
      ),
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        success: false,
        error: 'the user does not have permission to perform this action',
      });
    }
    const yearMonth = req.params.yearMonth;
    const year = yearMonth.split('-')[0];
    const month = yearMonth.split('-')[1];

    const expenses = await req.user.getExpenses({
      where: [
        sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), year),
        sequelize.where(
          sequelize.fn('month', sequelize.col('createdAt')),
          month
        ),
      ],
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
