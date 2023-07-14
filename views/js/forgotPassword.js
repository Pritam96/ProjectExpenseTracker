const BASE_URL = 'http://localhost:4000';

const form = document.querySelector('#forgotPassword-form');

form.addEventListener('submit', forgotPassword);

async function forgotPassword(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;

  try {
    const response = await axios.post(`${BASE_URL}/password/forgot`, {
      email,
    });
    alert('Check Your Inbox');
    window.location.href = './signin.html';
  } catch (error) {
    // fadeAlert('alert alert-danger', error.response.data.error, 5000);
    console.log(error);
  }
}
