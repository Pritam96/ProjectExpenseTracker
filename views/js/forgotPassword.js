const form = document.querySelector('#forgotPassword-form');

form.addEventListener('submit', forgotPassword);

async function forgotPassword(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;

  try {
    const response = await axios.post(`${BASE_URL}/password/forgot`, {
      email,
    });

    if (response.data) {
      getSuccessAlert(response.data.message);
    }
    // window.location.href = './signin.html';
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
  }, 5000);
}

function getErrorAlert(message) {
  errorAlert.textContent = message;
  errorAlert.classList.remove('d-none');
  errorAlert.classList.add('d-block');
  setTimeout(function () {
    document.getElementById('errorAlert').classList.add('d-none');
  }, 5000);
}
