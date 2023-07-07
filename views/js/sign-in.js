const BASE_URL = 'http://localhost:4000';

const form = document.querySelector('#signin-form');

const alert_content = document.querySelector('#alert');

form.addEventListener('submit', loginUser);

async function loginUser(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const result = await axios.post(`${BASE_URL}/user/login`, {
      email,
      password,
    });

    fadeAlert('alert alert-success', 'user logged in successfully', 3000);
    form.reset();
  } catch (error) {
    fadeAlert('alert alert-danger', error.response.data.error, 5000);
  }
}

function fadeAlert(alertType, alertBody, timeout) {
  alert_content.className = alertType;
  alert_content.textContent = alertBody;

  setTimeout(function () {
    alert_content.className = 'alert';
    alert_content.textContent = '';
  }, timeout);
}
