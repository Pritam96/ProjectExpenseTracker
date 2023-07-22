const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    // console.log(token);
    const user = jwt.verify(token, process.env.JWT_KEY_SECRET);
    // console.log('userId >>>> ', user.id);
    User.findByPk(user.id).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    // console.log(err);
    return res
      .status(401)
      .json({ success: false, error: `Authorization Error: ${err}` });
  }
};

module.exports = authenticate;
