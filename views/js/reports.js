const date_form = document.querySelector('#sortByDay');

const month_form = document.querySelector('#sortByMonth');

const dayTableSection = document.querySelector('#dayWiseTable');

const monthTableSection = document.querySelector('#monthWiseTable');

date_form.addEventListener('submit', getDailyReport);

month_form.addEventListener('submit', getMonthlyReport);

async function getDailyReport(e) {
  e.preventDefault();
  const date = document.querySelector('#selectedDate').value;
  try {
    const response = await axios.get(
      `${BASE_URL}/reports/dailyReport/${date}`,
      {
        headers: { Authorization: token },
      }
    );

    if (response.data.data.length > 0) {
      dayTableSection.textContent = '';
      response.data.data.forEach((expense) => {
        showTable(expense, dayTableSection);
      });

      // Adding last row (show total expenses)
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      const td3 = document.createElement('td');
      const td4 = document.createElement('td');
      td3.innerHTML = '<strong>Total Expenses</strong>';
      td4.innerHTML = `<strong>\u20B9${response.data.total}</strong>`;
      tr.className = 'table-success text-danger';
      tr.append(td1, td2, td3, td4);
      dayTableSection.appendChild(tr);
    } else {
      dayTableSection.textContent = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.setAttribute('colspan', '4');
      const p = document.createElement('p');
      p.className = 'h6';
      p.textContent = 'No data available for this date.';
      td.appendChild(p);
      tr.appendChild(td);
      dayTableSection.appendChild(tr);
    }
  } catch (error) {
    console.log(error.response.data.message);
    alert('Something went wrong!');
  }
}

async function getMonthlyReport(e) {
  e.preventDefault();
  const yearMonth = document.querySelector('#selectedMonth').value;
  try {
    const response = await axios.get(
      `${BASE_URL}/reports/MonthlyReport/${yearMonth}`,
      {
        headers: { Authorization: token },
      }
    );

    if (response.data.data.length > 0) {
      monthTableSection.textContent = '';
      response.data.data.forEach((expense) => {
        showTable(expense, monthTableSection);
      });

      // Adding last row (show total expenses)
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      const td3 = document.createElement('td');
      const td4 = document.createElement('td');
      td3.innerHTML = '<strong>Total Expenses</strong>';
      td4.innerHTML = `<strong>\u20B9${response.data.total}</strong>`;
      tr.className = 'table-success text-danger';
      tr.append(td1, td2, td3, td4);
      monthTableSection.appendChild(tr);
    } else {
      monthTableSection.textContent = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.setAttribute('colspan', '4');
      const p = document.createElement('p');
      p.className = 'h6';
      p.textContent = 'No data available for this month.';
      td.appendChild(p);
      tr.appendChild(td);
      monthTableSection.appendChild(tr);
    }
  } catch (error) {
    console.log(error.response.data.message);
    alert('Something went wrong!');
  }
}

function showTable(expense, appendToElement) {
  const date = expense.createdAt
    .replace(/T.*/, '')
    .split('-')
    .reverse()
    .join('-');
  const tr = document.createElement('tr');
  const td_date = document.createElement('td');
  td_date.textContent = date;
  const td_description = document.createElement('td');
  td_description.textContent = expense.description;
  const td_category = document.createElement('td');
  td_category.textContent = expense.category;
  const td_expense = document.createElement('td');
  td_expense.textContent = `\u20B9${expense.price}`;
  tr.append(td_date, td_description, td_category, td_expense);
  appendToElement.appendChild(tr);
}
