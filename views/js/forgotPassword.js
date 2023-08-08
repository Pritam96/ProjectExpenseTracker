const form = document.querySelector('#forgotPassword-form');

form.addEventListener('submit', forgotPassword);

async function forgotPassword(e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;

  try {
    const response = await axios.post(`${BASE_URL}/password/forgot`, {
      email,
    });
    alert(
      'Password reset link has been sent to your email. Please check you email.'
    );
    window.location.href = './signin.html';
  } catch (error) {
    console.log(error.response.data.message);
    alert('Something went wrong!');
  }
}
