const uuid = require('uuid');
const Brevo = require('@getbrevo/brevo');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

exports.postForgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log('User with this email id not exists');
      return;
    }

    // User exists
    const id = uuid.v4();
    await user.createForgotPassword({ id, active: true });

    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new Brevo.TransactionalEmailsApi();

    const sender = {
      email: 'pritammondal96official@gmail.com',
      name: 'Expense-Tracker',
    };

    const receivers = [
      {
        email: req.body.email,
      },
    ];

    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Sending with Brevo',
      textContent: 'reset password',
      htmlContent: `<h4>Expense-Tracker Password Reset Link</h4>
      <a href="http://localhost:4000/password/reset/${id}">Reset Password</a>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getResetPassword = async (req, res, next) => {
  const id = req.params.id;
  const row = await ForgotPassword.findOne({ where: { id } });
  if (row) {
    row.update({ active: false });
    res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    
        <!-- Bootstrap CSS -->
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossorigin="anonymous"
        />
    
        <title>Reset Password</title>
      </head>
      <body>
        <div class="container">
          <div class="col-xl-6 col-sm-8 m-4">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title mb-4">Update Your Password</h2>
                <form action="/password/update/${id}" method="GET" id="reset-form">
                  <div class="row">
                    <div class="col">
                      <div class="mb-3">
                
                        <label for="newPassword" class="form-label">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="mt-3 mb-3">
                    <button type="submit" class="btn btn-outline-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
          crossorigin="anonymous"
        ></script>
        <script>
            const form = document.querySelector('#reset-form');
            form.addEventListener('submit', initiate);
            function initiate(e){
              // e.preventDefault();
              console.log('called');
            }
        </script>
      </body>
    </html>
    `);
    res.end();
  }
};

// Not Working
exports.getUpdatePassword = async (req, res, next) => {
  const newPassword = req.query.newPassword;
  const resetPasswordId = req.params.id;
  console.log(newPassword, resetPasswordId);

  try {
    const forgotPassword = await ForgotPassword.findOne({
      where: { id: resetPasswordId },
    });

    const user = await User.findOne({ where: { id: forgotPassword.userId } });

    if (user) {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (!err) {
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            if (!err) {
              await user.update({ password: hash });
              res.status(201), json({ success: true });
            } else {
              console.log(err);
            }
          });
        } else {
          console.log(err);
        }
      });
    } else {
      return res.status(404).json({ success: false, error: 'No user Exists' });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, error });
  }
};
