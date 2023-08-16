const uuid = require('uuid');
const brevo = require('@getbrevo/brevo');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');

// POST => /password/forgot => INITIATE BREVO INSTANCE & SEND RESET PASSWORD MAIL
exports.postForgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({
        message: 'User with this email id not exists.',
      });
    }

    // User exists
    const id = uuid.v4();
    await user.createForgotPassword({ id: id, active: true });

    const defaultClient = brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new brevo.TransactionalEmailsApi();

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
      subject: 'Expense-Tracker password reset link',
      textContent: 'Reset password',
      htmlContent: `<h4>Expense-Tracker password reset link</h4>
      <a href="http://localhost:4000/password/reset/${id}">Reset Password</a>`,
    });

    res.status(200).json({
      message:
        'Password reset link has been sent to your email. Please check you email.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET => /password/reset/<id> => GET RESET PASSWORD FORM
exports.getResetPassword = async (req, res, next) => {
  const id = req.params.id;
  const row = await ForgotPassword.findOne({ where: { id: id, active: true } });
  if (!row) {
    res.status(404).send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Reset Password</title>
      </head>
      <body>
        <div class="container">
          <h3>Your Reset link is expired !!</h3>
        </div>
      </body>
    </html>`);
  } else {
    // row.update({ active: false });
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
        <div class="container d-flex justify-content-center align-items-center mt-5">
          <div class="col-10 col-sm-8 col-lg-5 col-xl-5">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title mb-4">Update Your Password</h2>
                <form action="/password/update" method="POST" id="reset-form">
                  <div class="row">
                    <div class="col">
                      <div class="mb-3">
                        <input type="hidden" value="${id}" id="resetPasswordId"/>
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
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
          crossorigin="anonymous"
        ></script>
        <script>
            const form = document.querySelector('#reset-form');
            form.addEventListener('submit', initiate);
            async function initiate(e) {
              e.preventDefault();
              console.log('called');
              const password = document.querySelector('#newPassword').value;
              const resetPasswordId = document.querySelector('#resetPasswordId').value;
              try {
                await axios.post('http://localhost:4000/password/update',{resetPasswordId, password });
                alert('Password Updated Successfully');
                form.reset();
                window.location.href = 'http://localhost:4000/signin.html';
              } catch(error) {
                console.log(error);
              }
            }
        </script>
      </body>
    </html>
    `);
  }
};

// POST => /password/update => UPDATE USER WITH NEW PASSWORD
exports.postUpdatePassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const resetPasswordId = req.body.resetPasswordId;

  try {
    const forgotPassword = await ForgotPassword.findOne({
      where: { id: resetPasswordId },
    });

    const user = await User.findOne({ where: { id: forgotPassword.userId } });

    if (user) {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await user.update({ password: encryptedPassword });
      await forgotPassword.update({ active: false });
      res.status(201).json({
        message: 'Password update successful.',
        data: updatedUser,
      });
    } else {
      return res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: error.message });
  }
};
