const logout_button = document.querySelector('#logout-button');

logout_button.addEventListener('click', logoutUser);

async function logoutUser(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('rzp_device_id');
  localStorage.removeItem('rzp_checkout_anon_id');
  window.location.href = './signin.html';
}

const down_button = document.querySelector('#download');
down_button.addEventListener('click', downloadPdf);

async function downloadPdf() {
  try {
    const response = await axios.get(`${BASE_URL}/reports/download`, {
      headers: { Authorization: token },
    });
    window.open(response.data.fileLink, '_blank');
    console.log('PDF downloaded successfully');
  } catch (error) {
    console.log(error);
    alert('User needs premium account to access this');
    window.location.href = './expense.html';
  }
}

// JavaScript to handle the navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navbarToggler.addEventListener('click', function () {
    navbarCollapse.classList.toggle('show');
  });
});
