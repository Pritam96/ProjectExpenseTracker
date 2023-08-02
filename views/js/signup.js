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
    // alert(result.data.message);
    fadeAlert('alert alert-success', result.data.message, 3000);
    window.location.href = './signin.html';
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
