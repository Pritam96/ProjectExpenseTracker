const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  payment_id: {
    type: Sequelize.STRING,
  },
  order_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  signature: {
    type: Sequelize.STRING,
  },
});

module.exports = Order;
