const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Create new user
// @route POST /user/add
exports.postCreateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!(name && email && password)) {
    return res.status(401).json({
      success: false,
      message: 'All input field is required.',
    });
  }

  try {
    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res.status(409).json({
        success: false,
        message: 'User Already Exist. Please Login.',
      });
    }

    // encrypt password with bcrypt
    const encryptedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

    const user = await User.create({
      name: name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    console.log('user created');

    res.status(201).json({
      success: true,
      message: 'User creation successful.',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc User Login
// @route POST /user/login
exports.postLoginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    return res.status(401).json({
      success: false,
      message: 'All input field is required.',
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        console.log('user logged in');

        res.status(201).json({
          success: true,
          message: 'Login successful.',
          token: generateAccessToken(user.id, user.email, user.isPremium),
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid Login Credentials',
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: 'User does not exist. Please create an account.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

function generateAccessToken(id, email, isPremium) {
  return jwt.sign({ id, email, isPremium }, process.env.JWT_KEY_SECRET, {
    expiresIn: '1d',
  });
}

exports.generateAccessToken = generateAccessToken;
