const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

// @desc Create new user
// @route POST /user/add
exports.postCreateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashData) => {
      if (err) console.log(err);
      const user = await User.create({
        name: name,
        email: email,
        password: hashData,
      });

      console.log('user created');

      res.status(201).json({
        success: true,
        data: user,
      });
    });
  } catch (error) {
    next(
      new ErrorResponse(
        'this email is already associated with another account',
        409
      )
    );
  }
};

// @desc User Login
// @route POST /user/login
exports.postLoginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findAll({
      where: { email: email },
    });

    if (!user[0]) {
      throw 'User with this email id not exist';
    }

    bcrypt.compare(password, user[0].password, (err, data) => {
      if (err) {
        throw `Something went wrong! ERROR: ${err}`;
        // console.log(err);
      }
      if (!data) {
        return res.status(400).json({
          success: false,
          error: 'Incorrect password',
        });
      }
      console.log('User Logged in');
      res.status(201).json({
        success: true,
        token: generateAccessToken(
          user[0].id,
          user[0].name,
          user[0].email,
          user[0].isPremium
        ),
      });
    });
  } catch (error) {
    next(new ErrorResponse(error, 409));
    // console.log(error);
  }
};

function generateAccessToken(id, name, email, isPremium) {
  return jwt.sign(
    { id: id, name: name, email: email, isPremium: isPremium },
    secretKey
  );
}

exports.generateAccessToken = generateAccessToken;
