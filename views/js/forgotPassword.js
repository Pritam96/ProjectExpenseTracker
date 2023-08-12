const form = document.querySelector('#forgotPassword-form');

form.addEventListener('submit', forgotPassword);

async function forgotPassword(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;

  try {
    const response = await axios.post(`${BASE_URL}/password/forgot`, {
      email,
    });

    console.log(response);
    alert(response.data.message);
    window.location.href = './signin.html';
  } catch (error) {
    console.log(error);
    alert('Error: ', error.response.data.message);
  }
}
