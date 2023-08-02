const hidden_input = document.querySelector('#expenseID');
hidden_input.style.display = 'none';

const form = document.querySelector('#expense-form');

const submit_button = document.querySelector('#submit-button');

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
  const tr = document.createElement('tr');
  // It requires to disable the table row at the time of edit
  tr.setAttribute('id', `tr_${item.id}`);

  const price_td = document.createElement('td');
  price_td.appendChild(document.createTextNode(`${item.price}`));

  const description_td = document.createElement('td');
  description_td.appendChild(document.createTextNode(`${item.description}`));

  // category column
  const category_td = document.createElement('td');
  category_td.appendChild(document.createTextNode(`${item.category}`));

  // Delete Button
  const delete_td = document.createElement('td');
  const delete_button = document.createElement('button');
  delete_button.className = 'btn btn-outline-secondary';
  // It requires to disable the delete button at the time of edit
  delete_button.setAttribute('id', `delete_button_${item.id}`);
  delete_button.appendChild(document.createTextNode('Delete'));
  delete_td.appendChild(delete_button);

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
  const edit_td = document.createElement('td');
  const edit_button = document.createElement('button');
  edit_button.className = 'btn btn-outline-warning';
  // It requires to disable the edit button at the time of edit
  edit_button.setAttribute('id', `edit_button_${item.id}`);
  edit_button.appendChild(document.createTextNode('Edit'));
  edit_td.appendChild(edit_button);

  edit_button.onclick = () => {
    document.querySelector('#expenseID').value = item.id;
    document.querySelector('#price').value = item.price;
    document.querySelector('#description').value = item.description;
    document.querySelector('#category').value = item.category;

    submit_button.className = 'btn btn-outline-warning mt-4';
    submit_button.textContent = 'Edit Expense';

    // Hide / Highlight the current table row & disable the buttons
    const the_tr = document.querySelector(`#tr_${item.id}`);
    the_tr.className = 'text-white bg-secondary';
    // disable the buttons
    document
      .querySelector(`#delete_button_${item.id}`)
      .classList.add('disabled');
    document.querySelector(`#edit_button_${item.id}`).classList.add('disabled');
  };

  tr.appendChild(price_td);
  tr.appendChild(description_td);
  tr.appendChild(category_td);
  tr.appendChild(delete_td);
  tr.appendChild(edit_td);

  document.querySelector('#response').appendChild(tr);
}

async function showAll(pageNumber) {
  //* getExpenses - get all items
  const currentPage = pageNumber || 1;
  try {
    const response = await axios.get(
      `${BASE_URL}/expense/?page=${currentPage}&pageSize=${pageSize}`,
      {
        headers: { Authorization: token },
      }
    );
    if (response.data.data.length === 0) {
      console.log('NO DATA IS AVAILABLE');
      document.querySelector('#response').innerHTML =
        '<tr><td colspan="5"><p class="h6">No Data is Available. Please add one!</p></td></tr>';
    } else {
      document.querySelector('#response').innerHTML = '';
      response.data.data.forEach((item) => {
        product(item);
      });
      showPagination(currentPage, Number(response.data.count));
    }
  } catch (error) {
    console.log(error.message);
    alert('Token Authorization Error! Please Login again');
    window.location.href = './signin.html';
  }
}

showAll();

// Pagination
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
    buttonPrevious.className = 'btn btn-outline-dark';
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
  buttonCurrent.className = 'btn btn-outline-dark';
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
    buttonNext.className = 'btn btn-outline-dark';
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
