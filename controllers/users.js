const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');

// @desc Create new user
// @route POST /user/add
exports.postCreateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    console.log('user created');

    res.status(201).json({
      success: true,
      data: user,
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
    const user_email = await User.findAll({
      where: { email: email },
    });

    if (!user_email[0]) {
      throw 'User with this email id not exist';
    }

    const user_password = await User.findAll({
      where: { password: password },
    });

    if (!user_password[0]) {
      throw 'Wrong email id or password';
    }

    console.log('User Logged in');
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    next(new ErrorResponse(error, 409));
  }
};
