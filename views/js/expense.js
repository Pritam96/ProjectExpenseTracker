const BASE_URL = 'http://localhost:4000';

const hidden_input = document.querySelector('#expenseID');
hidden_input.style.display = 'none';

const form = document.querySelector('#expense-form');

const submit_button = document.querySelector('#submit-button');

const token = localStorage.getItem('token');

const user = parseJwt(token);

// let total = 0;
let pageSize = 5;

form.addEventListener('submit', addToTheList);

async function addToTheList(e) {
  e.preventDefault();
  const id = document.querySelector('#expenseID').value;
  const price = Number(document.querySelector('#price').value);
  const description = document.querySelector('#description').value;
  const category = document.querySelector('#category').value;

  if (id === '' || id === null) {
    //* postAddExpense - Create a new expense
    try {
      const response = await axios.post(
        `${BASE_URL}/expense`,
        {
          price,
          description,
          category,
        },
        {
          headers: { Authorization: token },
        }
      );
      // console.log(response);
      form.reset();
      console.log('Record Added');
      showAll();
    } catch (error) {
      console.log(error.message);
      alert('Token Authorization Error! Please Login again');
      window.location.href = './signin.html';
    }
  } else {
    //* postEditExpense - Update an expense
    try {
      const response = await axios.post(
        `${BASE_URL}/expense/edit`,
        {
          id,
          price,
          description,
          category,
        },
        {
          headers: { Authorization: token },
        }
      );
      // console.log(response);
      form.reset();
      console.log('Record Updated');

      // Back to the Add Expense Button
      submit_button.className = 'btn btn-outline-primary mt-4';
      submit_button.textContent = 'Add Expense';

      showAll();
    } catch (error) {
      console.log(error.message);
      alert('Token Authorization Error! Please Login again');
      window.location.href = './signin.html';
    }
  }
}

function product(item) {
  const card = document.createElement('div');
  card.className = 'card';
  // It requires to disable the card at the time of edit
  card.setAttribute('id', `card_${item.id}`);

  const card_body = document.createElement('div');
  card_body.className = 'card-body';

  const row = document.createElement('div');
  row.className = 'row';

  const price_col = document.createElement('div');
  price_col.className = 'col';
  price_col.appendChild(document.createTextNode(`${item.price} Rupees`));

  const description_col = document.createElement('div');
  description_col.className = 'col';
  description_col.appendChild(document.createTextNode(`${item.description}`));

  // category column
  const category_col = document.createElement('div');
  category_col.className = 'col';
  category_col.appendChild(document.createTextNode(`${item.category}`));

  // Delete Button
  const delete_div = document.createElement('div');
  delete_div.className = 'col';
  const delete_button = document.createElement('button');
  delete_button.className = 'btn btn-outline-secondary';
  // It requires to disable the delete button at the time of edit
  delete_button.setAttribute('id', `delete_button_${item.id}`);
  delete_button.appendChild(document.createTextNode('Delete'));
  delete_div.appendChild(delete_button);

  delete_button.onclick = () => {
    deleteItem();

    //* postDeleteExpense - Delete an item
    async function deleteItem() {
      try {
        const response = await axios.delete(
          `${BASE_URL}/expense/delete/${item.id}`,
          { headers: { Authorization: token } }
        );
        console.log('Record Deleted');
        showAll();
      } catch (error) {
        console.log(error.message);
        alert('Token Authorization Error! Please Login again');
        window.location.href = './signin.html';
      }
    }
  };

  // Edit Button
  const edit_div = document.createElement('div');
  edit_div.className = 'col';
  const edit_button = document.createElement('button');
  edit_button.className = 'btn btn-outline-warning';
  // It requires to disable the edit button at the time of edit
  edit_button.setAttribute('id', `edit_button_${item.id}`);
  edit_button.appendChild(document.createTextNode('Edit'));
  edit_div.appendChild(edit_button);

  edit_button.onclick = () => {
    document.querySelector('#expenseID').value = item.id;
    document.querySelector('#price').value = item.price;
    document.querySelector('#description').value = item.description;
    document.querySelector('#category').value = item.category;

    submit_button.className = 'btn btn-outline-warning mt-4';
    submit_button.textContent = 'Edit Expense';

    // Hide / Highlight the current row & disable the buttons
    const the_row = document.querySelector(`#card_${item.id}`);
    the_row.className = 'card text-white bg-secondary';
    // disable the buttons
    document
      .querySelector(`#delete_button_${item.id}`)
      .classList.add('disabled');
    document.querySelector(`#edit_button_${item.id}`).classList.add('disabled');
  };

  row.appendChild(price_col);
  row.appendChild(description_col);
  row.appendChild(category_col);
  row.appendChild(delete_div);
  row.appendChild(edit_div);

  card_body.appendChild(row);
  card.appendChild(card_body);

  document.querySelector('#response').appendChild(card);
  // document.querySelector(
  //   '#total'
  // ).innerHTML = `<h5>Total value worth of products: Rs ${total}</h5>`;
}

async function showAll(pageNumber) {
  // total = 0;
  //* getExpenses - get all items
  const currentPage = pageNumber || 1;
  try {
    const response = await axios.get(
      `${BASE_URL}/expense/?page=${currentPage}&pageSize=${pageSize}`,
      // `${BASE_URL}/expense/?page=${currentPage}`,

      {
        headers: { Authorization: token },
      }
    );
    // console.log(response.data);
    if (response.data.data.length === 0) {
      document.querySelector('#response').innerHTML = '';
      console.log('NO DATA IS AVAILABLE');
      // document.querySelector(
      //   '#total'
      // ).innerHTML = `<h5>Total value worth of products: Rs 0</h5>`;
    } else {
      document.querySelector('#response').innerHTML = '';
      response.data.data.forEach((item) => {
        // total += Number(item.price);
        product(item);
      });
      showPagination(currentPage, Number(response.data.count));
    }

    // check user is premium or not
    if (!user.isPremium) {
      document.querySelector('#rzp-button1').className =
        'btn btn-outline-success mt-5';
    }
  } catch (error) {
    console.log(error.message);
    alert('Token Authorization Error! Please Login again');
    window.location.href = './signin.html';
  }
}

showAll();

//* Razorpay Implementation

const razorpay_button = document.querySelector('#rzp-button1');
razorpay_button.addEventListener('click', checkout);

async function checkout(e) {
  e.preventDefault();
  try {
    const response = await axios.get(`${BASE_URL}/checkout`, {
      headers: { Authorization: token },
    });

    const options = {
      key: response.data.key_id,
      name: 'ABC Company',
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
    alert('Token Authorization Error! Please Login again');
    window.location.href = './signin.html';
  }
}

function showPagination(currentPage, totalPages) {
  document.querySelector('#pagination').innerHTML = '';
  let nextPage = null;
  let previousPage = null;

  if (Math.floor(totalPages / pageSize > currentPage)) {
    nextPage = currentPage + 1;
  }
  if (currentPage > 1) {
    previousPage = currentPage - 1;
  }
  // console.log(previousPage, currentPage, nextPage);

  if (previousPage) {
    const buttonPreviousCol = document.createElement('div');
    buttonPreviousCol.className = 'col-auto';
    const buttonPrevious = document.createElement('button');
    buttonPrevious.innerHTML = previousPage;
    buttonPreviousCol.append(buttonPrevious);
    buttonPrevious.addEventListener('click', () => {
      showAll(previousPage);
    });
    document.querySelector('#pagination').append(buttonPreviousCol);
  }
  const buttonCurrentCol = document.createElement('div');
  buttonCurrentCol.className = 'col-auto';
  const buttonCurrent = document.createElement('button');
  buttonCurrent.innerHTML = currentPage;
  buttonCurrentCol.append(buttonCurrent);
  buttonCurrent.addEventListener('click', () => {
    showAll(currentPage);
  });
  document.querySelector('#pagination').append(buttonCurrentCol);
  if (nextPage) {
    const buttonNextCol = document.createElement('div');
    buttonNextCol.className = 'col-auto';
    const buttonNext = document.createElement('button');
    buttonNext.innerHTML = nextPage;
    buttonNextCol.append(buttonNext);
    buttonNext.addEventListener('click', () => {
      showAll(nextPage);
    });
    document.querySelector('#pagination').append(buttonNextCol);
  }
}

const rowButton = document.querySelector('#row-button');
rowButton.addEventListener('click', () => {
  pageSize = Number(document.querySelector('#row-per-page').value);
  showAll();
});

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
