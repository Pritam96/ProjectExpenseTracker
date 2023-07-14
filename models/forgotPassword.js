const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ForgotPassword = sequelize.define('forgotPassword', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  expiresBy: Sequelize.DATE,
});

module.exports = ForgotPassword;
