// Set the canvas
const canvas = document.getElementById("particleCanvas");

// The particle is 2D
const ctx = canvas.getContext("2d");

// Our pop up message
const responseMsg = document.getElementById("responseMsg");

// Our button sent
const sendBtn = document.getElementById("sendBtn");

// Storing our particle system string
let particles = [];

// The chosen color
let chosenColor = "#ffffff";

// --- (You already probably seen more then once by now XD)
// --- Setting up our particcle system, XY position, the size, death time, color, ect...
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 4 + 1;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 100;
  }

  // --- Constantly updating the particle positon in real time
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.radius *= 0.97;
  }

  // We're stylizing our particle system, the trails and is movements
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fill();
  }
}

// Animating our particle system dynamically in our canavas
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

animate();

// --- Our particle will only move with mouse inside the canvas
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const r = Math.floor((x / canvas.width) * 255);
  const g = Math.floor((y / canvas.height) * 255);
  const b = 200;
  chosenColor = `rgb(${r},${g},${b})`;

  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(x, y, chosenColor));
  }
});


// Setting up our button system
sendBtn.addEventListener("click", async () => {
  const thought = document.getElementById("thought").value.trim();
  
  // If thoughts is missing, warn the user
  if (!thought) {
    alert("Please enter a thought first!");
    return;
  }
  
// --- This is we're we sent our data to our .py to the data.txt
  const payload = {
    color: chosenColor,
    message: thought,
    timestamp: new Date().toISOString(),
  };

  // -- Initialize the fetch data to our .json
  const res = await fetch("/postDataFetch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  // Sending the data the data that is presenting in the canvas 
  responseMsg.textContent = result.message;
  responseMsg.style.background = chosenColor;
  responseMsg.style.color = "#fff";
  responseMsg.style.textShadow = "0 0 5px #000";
  responseMsg.classList.remove("hidden");
  responseMsg.animate(
    [{ opacity: 0 }, { opacity: 1, transform: "scale(1.1)" }],
    { duration: 600, easing: "ease-out", fill: "forwards" }
  );
});