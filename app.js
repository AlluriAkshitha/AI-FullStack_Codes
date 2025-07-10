// Get events from localStorage or start with empty array
let events = JSON.parse(localStorage.getItem('events') || '[]');

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents() {
  const list = document.getElementById('eventsList');
  list.innerHTML = '';
  const now = new Date();
  events.forEach((event, i) => {
    const eventDate = new Date(event.datetime);
    let diff = eventDate - now;
    let countdown = '';
    if (diff > 0) {
      let days = Math.floor(diff / (1000*60*60*24));
      let hours = Math.floor((diff / (1000*60*60)) % 24);
      let mins = Math.floor((diff / (1000*60)) % 60);
      let secs = Math.floor((diff / 1000) % 60);
      countdown = days + ' Days ' + hours + ':' + mins + ':' + secs;
    } else {
      countdown = '🎉 ' + event.title + ' is happening now!';
    }
    let div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
      <div><b>${event.title}</b></div>
      <div>${event.description || ''}</div>
      <div>${event.category}</div>
      <div>${event.datetime}</div>
      <div>${countdown}</div>
      <button onclick="deleteEvent(${i})">Delete</button>
    `;
    list.appendChild(div);
  });
}

function deleteEvent(i) {
  if (confirm('Delete this event?')) {
    events.splice(i, 1);
    saveEvents();
    renderEvents();
  }
}

// Form submit
const form = document.getElementById('eventForm');
form.onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const datetime = document.getElementById('datetime').value;
  const email = document.getElementById('email').value;
  const category = document.getElementById('category').value;
  if (!title || !datetime || new Date(datetime) <= new Date()) {
    alert('Please enter a title and a future date/time.');
    return;
  }
  events.push({title, description, datetime, email, category});
  saveEvents();
  form.reset();
  renderEvents();
};

// Update countdowns every second
setInterval(renderEvents, 1000);

// Initial render
renderEvents();