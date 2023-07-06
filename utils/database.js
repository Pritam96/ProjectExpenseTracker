const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'task-expense-tracker-db',
  'root',
  'pritam123',
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;
