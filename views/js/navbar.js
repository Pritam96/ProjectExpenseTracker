const token = localStorage.getItem('token');
const user = parseJwt(token);

// Jwt token decryption
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// Home Button
const homepage_button = document.querySelector('#homepage');
homepage_button.addEventListener('click', () => {
  window.location.href = './expense.html';
});

// Reports Button
const viewReports_button = document.querySelector('#reports');
viewReports_button.addEventListener('click', () => {
  window.location.href = './reports.html';
});

// Download Reports Button
const downloadReports_button = document.querySelector('#download');
downloadReports_button.addEventListener('click', downloadPdf);

async function downloadPdf() {
  if (!user.isPremium) {
    return alert('User need to buy premium to access this feature');
  }
  try {
    const response = await axios.get(`${BASE_URL}/reports/download`, {
      headers: { Authorization: token },
    });
    window.open(response.data.fileLink, '_blank');
    console.log('PDF downloaded successfully');
  } catch (error) {
    console.log(error.message);
    window.location.href = './expense.html';
  }
}

// Leaderboard Button
const leaderBoard_button = document.querySelector('#leaderboard');
leaderBoard_button.addEventListener('click', loadLeaderboard);

function loadLeaderboard() {
  if (!user.isPremium) {
    return alert('User need to buy premium to access this feature');
  } else {
    window.location.href = './leaderboard.html';
  }
}

// Buy Premium Button - Razorpay feature implementation
// const buy_navItem = document.querySelector('#nav-item-buy-premium');
// if (!user.isPremium) {
//   buy_navItem.classList.add('disable');
// }

const buyPremium_button = document.querySelector('#buy-premium');
buyPremium_button.addEventListener('click', buyPremium);

async function buyPremium() {
  if (user.isPremium) {
    return alert('You are already a premium user.');
  }
  try {
    const response = await axios.get(`${BASE_URL}/checkout`, {
      headers: { Authorization: token },
    });

    const options = {
      key: response.data.key_id,
      name: 'Test Company',
      description: 'Test Transaction',
      image:
        'https://png.pngtree.com/template/20201023/ourmid/pngtree-fitness-logo-with-letter-tg-icon-idea-of-logo-design-image_427180.jpg',
      order_id: response.data.order.id,

      // handles successful payment
      handler: async function (response) {
        const update = await axios.post(
          `${BASE_URL}/checkout/update`,
          {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          },
          {
            headers: { Authorization: token },
          }
        );

        console.log('Transaction Update: ', update);
        alert('You are a premium user now!');
        // set new token to localStorage
        localStorage.setItem('token', update.data.token);
        // ... Remove pay button with user isPremium = true
        // ... Premium functionality here
        window.location.reload(); // reload the page
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', function (response) {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      console.log(response);
      alert('Something went wrong');
    });
  } catch (error) {
    console.log(error.message);
    alert('Error: ', error.message);
  }
}

// Logout Button
const logout_button = document.querySelector('#logout-button');
logout_button.addEventListener('click', logoutUser);

function logoutUser(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('rzp_device_id');
  localStorage.removeItem('rzp_checkout_anon_id');
  window.location.href = './signin.html';
}

// JavaScript to handle the navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navbarToggler.addEventListener('click', function () {
    navbarCollapse.classList.toggle('show');
  });
});
