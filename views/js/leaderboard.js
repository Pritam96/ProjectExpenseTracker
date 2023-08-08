const leaderboard_div = document.querySelector('#leaderboard_response');

async function showLeaderBoard() {
  try {
    const response = await axios.get(`${BASE_URL}/expense/leaderboard`, {
      headers: { Authorization: token },
    });

    if (response.data.data.length > 0) {
      leaderboard_div.textContent = '';
      response.data.data.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const card_body = document.createElement('div');
        card_body.className = 'card-body';

        const row = document.createElement('div');
        row.className = 'row';

        const col_index = document.createElement('div');
        col_index.className = 'col';
        col_index.textContent = `#${+index + 1}`;

        const col_name = document.createElement('div');
        col_name.className = 'col';
        col_name.textContent = data.name;

        const col_expense = document.createElement('div');
        col_expense.className = 'col';
        col_expense.textContent = `\u20B9${data.totalExpense}`;

        row.appendChild(col_index);
        row.appendChild(col_name);
        row.appendChild(col_expense);

        card_body.appendChild(row);

        card.appendChild(card_body);

        leaderboard_div.appendChild(card);
      });
    }
  } catch (error) {
    console.log(error.response.data.message);
    alert('Something went wrong!');
    window.location.href = './expense.html';
  }
}

showLeaderBoard();
