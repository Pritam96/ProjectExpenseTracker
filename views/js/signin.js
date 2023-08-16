const form = document.querySelector('#signin-form');

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
    if (response.data) {
      getSuccessAlert(response.data.message);
    }
    window.location.href = './expense.html';
  } catch (error) {
    console.log(error);
    if (error.response.data) getErrorAlert(error.response.data.message);
  }
}

// Success Alert Function

function getSuccessAlert(message) {
  errorAlert.textContent = message;
  errorAlert.classList.remove('alert-danger');
  errorAlert.classList.add('alert-success');
  errorAlert.classList.remove('d-none');
  errorAlert.classList.add('d-block');
  setTimeout(function () {
    document.getElementById('errorAlert').classList.add('d-none');
  }, 3000);
}

function getErrorAlert(message) {
  errorAlert.textContent = message;
  errorAlert.classList.remove('d-none');
  errorAlert.classList.add('d-block');
  setTimeout(function () {
    document.getElementById('errorAlert').classList.add('d-none');
  }, 5000);
}
