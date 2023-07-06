const form = document.querySelector('#signup-form');

form.addEventListener('submit', showAll);

function showAll(e) {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  console.log(`Name: ${name}, Email: ${email}`);
}
