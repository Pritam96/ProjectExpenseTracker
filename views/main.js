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
    alert_content.className = 'alert alert-success';
    alert_content.textContent = 'user is registered successfully';
    // console.log(result.data);
    form.reset();
  } catch (error) {
    console.log(error.response.data.error);
    alert_content.className = 'alert alert-danger';
    alert_content.textContent = error.response.data.error;
  }
}
