const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./utils/database');

// const Expense = require('./models/expense');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const errorHandler = require('./middleware/error');

const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

app.use(errorHandler);

// User.hasMany(Expense);
// Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

const PORT = 4000;

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => console.log(err));
