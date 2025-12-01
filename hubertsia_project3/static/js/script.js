// Connect to Flask-SocketIO
const socket = io();

socket.on("connect", () => console.log("Connected to TheCheese server"));
socket.on("connect-confirm", (data) => console.log("Server confirms:", data));

// Load all moods on connect
socket.on("init-moods", (moods) => moods.forEach(spawnCheeseBubble));

// Receive new moods live from everyone
socket.on("new-mood", (mood) => spawnCheeseBubble(mood));

const form = document.getElementById("moodForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const mood = document.getElementById("mood").value;
  const comment = document.getElementById("comment").value;

  const data = { mood, comment };
  socket.emit("submit-mood", data);
  form.reset();
});

// Spawn a bubble based on mood — unique color + animation
function spawnCheeseBubble(data) {
  const space = document.getElementById("moodSpace");
  const div = document.createElement("div");
  div.classList.add("cheese-bubble", `mood-${data.mood}`);

  div.innerHTML = `<span>${data.comment || "Feeling cheesy!"}</span>`;
  space.appendChild(div);

  // Random start position and direction
  const pos = { x: Math.random() * (window.innerWidth - 150), y: Math.random() * (window.innerHeight - 150) };
  const vel = { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 };
  const bubble = { el: div, x: pos.x, y: pos.y, vx: vel.x, vy: vel.y };
  bubbles.push(bubble);

  // Kick off movement loop if needed
  if (!animating) {
    animating = true;
    requestAnimationFrame(moveBubbles);
  }

  // Clean up after 30 seconds
  setTimeout(() => {
    div.remove();
    const idx = bubbles.indexOf(bubble);
    if (idx > -1) bubbles.splice(idx, 1);
  }, 30000);
}

// Physics bouncing animation
const bubbles = [];
let animating = false;

function moveBubbles() {
  for (const b of bubbles) {
    b.x += b.vx;
    b.y += b.vy;

    // bounce off walls
    if (b.x <= 0 || b.x >= window.innerWidth - 150) b.vx *= -1;
    if (b.y <= 0 || b.y >= window.innerHeight - 150) b.vy *= -1;

    b.el.style.left = `${b.x}px`;
    b.el.style.top = `${b.y}px`;
  }
  if (bubbles.length > 0) requestAnimationFrame(moveBubbles);
  else animating = false;
}