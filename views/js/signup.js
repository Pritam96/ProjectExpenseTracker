const BASE_URL = 'http://localhost:4000';

const form = document.querySelector('#signup-form');

const alert_content = document.querySelector('#alert');

form.addEventListener('submit', createUser);

async function createUser(e) {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const result = await axios.post(`${BASE_URL}/user/add`, {
      name,
      email,
      password,
    });

    form.reset();
    alert('User is successfully registered');
    // fadeAlert('alert alert-success', 'user is registered successfully', 3000);
    window.location.href = './signin.html';
  } catch (error) {
    // fadeAlert('alert alert-danger', error.response.data.error, 5000);
    console.log(error);
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
