require('dotenv').config();

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const checkoutRoutes = require('./routes/razorpay');
const forgotPasswordRoutes = require('./routes/forgotPassword');
const ReportsRoutes = require('./routes/report');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    return res.status(200).json({});
  }
  next();
});

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/password', forgotPasswordRoutes);
app.use('/reports', ReportsRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `views/${req.url}`));
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.header(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


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
