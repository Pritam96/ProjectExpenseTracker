const form = document.querySelector('#signup-form');

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
