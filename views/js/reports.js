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
    } else {
      const p = document.createElement('p');
      p.textContent = 'No data available for this date.';
      dayTableSection.textContent = '';
      dayTableSection.appendChild(p);
    }
  } catch (error) {
    console.log(error.message);
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
    } else {
      const p = document.createElement('p');
      p.textContent = 'No data available for this month.';
      monthTableSection.textContent = '';
      monthTableSection.appendChild(p);
    }
  } catch (error) {
    console.log(error.message);
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
  td_expense.textContent = expense.price;
  tr.append(td_date, td_description, td_category, td_expense);
  appendToElement.appendChild(tr);
}
