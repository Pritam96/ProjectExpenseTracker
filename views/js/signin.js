const form = document.querySelector('#signin-form');

const alert_content = document.querySelector('#alert');

form.addEventListener('submit', loginUser);

async function loginUser(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    window.location.href = './expense.html';
  } catch (error) {
    console.log(error.message);
    fadeAlert('alert alert-danger', error.response.data.message, 4000);
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
