const form = document.getElementById('profileForm');
const preview = document.getElementById('preview');
const cardsContainer = document.getElementById('cardsContainer');
let cards = JSON.parse(localStorage.getItem('cards')) || [];

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const bio = document.getElementById('bio').value;
  const borderStyle = document.getElementById('borderStyle').value;
  const image = preview.querySelector('img')?.src || '';

  if (!name || !bio || !image) {
    alert('Fill all fields and preview your image!');
    return;
  }

  cards.push({ name, bio, image, borderStyle, theme: 'light' });
  saveCards();
  renderCards();
  form.reset();
  preview.innerHTML = '';
});

document.getElementById('previewBtn').addEventListener('click', () => {
  const file = document.getElementById('image').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${e.target.result}">`;
    };
    reader.readAsDataURL(file);
  }
});

function saveCards() {
  localStorage.setItem('cards', JSON.stringify(cards));
}

function renderCards() {
  cardsContainer.innerHTML = '';
  cards.forEach((card, index) => {
    const div = createCardElement(card, index);
    cardsContainer.appendChild(div);
  });
}

function createCardElement(card, index) {
  const div = document.createElement('div');
  div.className = 'card';
  if (card.theme === 'dark') div.classList.add('dark');

  const img = document.createElement('img');
  img.src = card.image;
  if (card.borderStyle === 'rounded') {
    img.style.borderRadius = '10px';
  } else if (card.borderStyle === 'circle') {
    img.style.borderRadius = '50%';
  }

  const name = document.createElement('h3');
  name.textContent = card.name;

  const bio = document.createElement('p');
  bio.textContent = card.bio;

  const themeBtn = document.createElement('button');
  themeBtn.textContent = 'Toggle Theme';
  themeBtn.onclick = () => {
    card.theme = card.theme === 'light' ? 'dark' : 'light';
    div.classList.toggle('dark'); // THIS is the fix 🪄
    saveCards();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    cards.splice(index, 1);
    saveCards();
    renderCards();
  };

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    document.getElementById('name').value = card.name;
    document.getElementById('bio').value = card.bio;
    document.getElementById('borderStyle').value = card.borderStyle;
    preview.innerHTML = `<img src="${card.image}">`;
    cards.splice(index, 1);
    saveCards();
    renderCards();
  };

  div.appendChild(img);
  div.appendChild(name);
  div.appendChild(bio);
  div.appendChild(themeBtn);
  div.appendChild(editBtn);
  div.appendChild(deleteBtn);

  return div;
}

renderCards();
