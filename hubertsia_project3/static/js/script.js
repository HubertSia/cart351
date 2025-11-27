const socket = io();
const form = document.getElementById("cheeseForm");
const board = document.getElementById("board");

// Emit when form is submitted
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cheese = document.getElementById("cheese").value.trim();
  const mood = document.getElementById("mood").value;
  if (!cheese || !mood) return;

  socket.emit("newCheese", { cheese, mood });
  document.getElementById("cheese").value = "";
});

// Handle broadcasted message from server
socket.on("cheeseFromServer", (item) => {
  addCard(item);
});

// Load saved entries when user first connects
async function loadEntries() {
  const res = await fetch("/api/all");
  const data = await res.json();
  board.innerHTML = "";
  data.forEach((item) => addCard(item));
}

function addCard(item) {
  const div = document.createElement("div");
  div.className = "cheese-card " + item.mood.toLowerCase();
  div.innerHTML = `
    <h3>${item.cheese}</h3>
    <p>Mood: ${item.mood}</p>
    <small>${new Date(item.timestamp).toLocaleString()}</small>
  `;
  board.appendChild(div);
}

loadEntries();