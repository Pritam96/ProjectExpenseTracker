const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./utils/database');

// const Expense = require('./models/expense');

const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors());

app.use('/user', userRoutes);

const PORT = 4000;

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => console.log(err));
