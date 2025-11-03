const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const responseMsg = document.getElementById("responseMsg");
const sendBtn = document.getElementById("sendBtn");
let particles = [];
let chosenColor = "#ffffff";

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

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.radius *= 0.97;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fill();
  }
}

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

sendBtn.addEventListener("click", async () => {
  const thought = document.getElementById("thought").value.trim();
  if (!thought) {
    alert("Please enter a thought first!");
    return;
  }

  const payload = {
    color: chosenColor,
    message: thought,
    timestamp: new Date().toISOString(),
  };

  const res = await fetch("/postDataFetch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

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