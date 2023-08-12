const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST => /user/add => CREATE NEW USER
exports.postCreateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!(name && email && password)) {
    return res.status(401).json({
      message: 'All input field is required.',
    });
  }

  try {
    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res.status(409).json({
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
      message: 'User creation successful.',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST => /user/login => LOGIN USER
exports.postLoginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    return res.status(401).json({
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
          message: 'Login successful.',
          token: generateAccessToken(user.id, user.email, user.isPremium),
        });
      } else {
        return res.status(401).json({
          message: 'Invalid login credentials',
        });
      }
    } else {
      return res.status(401).json({
        message:
          'No account found with the provided email address. Please signup first.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GENERATE JWT TOKEN
function generateAccessToken(id, email, isPremium) {
  return jwt.sign({ id, email, isPremium }, process.env.JWT_KEY_SECRET, {
    expiresIn: '1d',
  });
}

exports.generateAccessToken = generateAccessToken;
