require('dotenv').config();

const express = require('express');

// const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./utils/database');

// const Expense = require('./models/expense');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const checkoutRoutes = require('./routes/razorpay');
const forgotPasswordRoutes = require('./routes/forgotPassword');

const errorHandler = require('./middleware/error');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/password', forgotPasswordRoutes);

app.use(errorHandler);

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
