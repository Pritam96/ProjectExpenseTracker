const logout_button = document.querySelector('#logout-button');

logout_button.addEventListener('click', logoutUser);

async function logoutUser(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('rzp_device_id');
  localStorage.removeItem('rzp_checkout_anon_id');
  window.location.href = './signin.html';
}
