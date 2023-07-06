const BASE_URL = 'http://localhost:4000';

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
    console.log(result);
    form.reset();
  } catch (error) {
    console.log(error);
  }
}
