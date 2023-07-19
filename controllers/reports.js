const sequelize = require('../utils/database');

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
    const month = req.params.month;
    const expenses = await req.user.getExpenses({
      where: sequelize.where(
        sequelize.fn('month', sequelize.col('createdAt')),
        month
      ),
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
