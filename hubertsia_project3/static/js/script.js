// Connect to Flask-SocketIO
const socket = io();

// Once connected, show a console log for debugging
socket.on("connect", () => console.log("Connected to TheCheese server"));

// Server confirms connection explicitly
socket.on("connect-confirm", (data) => console.log("Server confirms:", data));

// Load all moods on connect
socket.on("init-moods", (moods) => moods.forEach(spawnCheeseBubble));

// Receive new moods live from everyone
socket.on("new-mood", (mood) => spawnCheeseBubble(mood));

// Form Handling
const form = document.getElementById("moodForm");

// Capture form submission without refreshing the page
form.addEventListener("submit", (e) => {
  e.preventDefault();

    // Extract mood and comment values from form inputs
  const mood = document.getElementById("mood").value;
  const comment = document.getElementById("comment").value;

  // Package into an object for sending
  const data = { mood, comment };
  
  // Send to Flask-SocketIO backend
  socket.emit("submit-mood", data);
  
  // Clear form after submission
  form.reset();
});


// --- Function to Create and Animate “Cheese Bubbles” ---

// Spawn a bubble based on mood — unique color + animation
function spawnCheeseBubble(data) {
  
  // Container for bubbles
  const space = document.getElementById("moodSpace");
  
  // Create the visual bubble
  const div = document.createElement("div");
  
  // Add styling classes
  div.classList.add("cheese-bubble", `mood-${data.mood}`);

  
  // Show either user's comment or default message
  div.innerHTML = `<span>${data.comment || "Feeling cheesy!"}</span>`;
  space.appendChild(div);

  // Random start position and direction
  const pos = { x: Math.random() * (window.innerWidth - 150), y: Math.random() * (window.innerHeight - 150) };
  const vel = { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 };
  
  // Store bubble physics data for animation loop
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


// --- Bubble Animation Logic ---

// Active bubbles in motion
const bubbles = [];

// Flag to track if animation is active
let animating = false;

function moveBubbles() {
  for (const b of bubbles) {
    
    // Move bubble by velocity
    b.x += b.vx;
    b.y += b.vy;

    // Reverse velocity if bubble hits window edge ("bounce")    if (b.x <= 0 || b.x >= window.innerWidth - 150) b.vx *= -1;
    if (b.y <= 0 || b.y >= window.innerHeight - 150) b.vy *= -1;

    // Update bubble position visually
    b.el.style.left = `${b.x}px`;
    b.el.style.top = `${b.y}px`;
  }
  
  // Continue looping if bubbles exist; otherwise, stop animation
  if (bubbles.length > 0) requestAnimationFrame(moveBubbles);
  else animating = false;
}