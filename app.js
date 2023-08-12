// Load env vars
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Connect to DB
const sequelize = require('./utils/database');

// Route files
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const checkoutRoutes = require('./routes/razorpay');
const forgotPasswordRoutes = require('./routes/forgotPassword');
const ReportsRoutes = require('./routes/report');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Model files
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');

// Mount Routers
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/password', forgotPasswordRoutes);
app.use('/reports', ReportsRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `views/${req.url}`));
});

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.header(error.status || 500);
  if (error.status === 404) {
    return res.sendFile(path.join(__dirname, `views/404.html`));
  }
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Sequelize associations
User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

const PORT = process.env.PORT || 4000;

sequelize
  // .sync({ force: true })
  // .sync({ alter: true })
  .sync()
  .then((result) => {
    app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => console.log(err));
