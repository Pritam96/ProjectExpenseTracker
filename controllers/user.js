const User = require('../models/user');

exports.postCreateUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existing_user = await User.findAll({ where: { email: email } });
    if (existing_user) {
      return res.status(409).json({
        success: false,
        data: {},
        error: 'email id is already exists in the database',
      });
    }
    const new_user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    res.status(201).json({
      success: true,
      data: new_user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: `ERROR: ${error}`,
    });
  }
};
