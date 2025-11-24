const form = document.getElementById("cheeseForm");
const board = document.getElementById("board");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cheese = document.getElementById("cheese").value.trim();
  const mood = document.getElementById("mood").value;

  if (!cheese || !mood) return;

  await fetch("/api/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cheese, mood }),
  });

  document.getElementById("cheese").value = "";
  loadEntries();
});

async function loadEntries() {
  const res = await fetch("/api/all");
  const data = await res.json();

  board.innerHTML = "";
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cheese-card " + item.mood.toLowerCase();
    div.innerHTML = `
      <h3>${item.cheese}</h3>
      <p>Mood: ${item.mood}</p>
      ${
        item.info
          ? `<small>${item.info.country || ""} | ${item.info.milk || ""} | ${
              item.info.texture || ""
            }</small>`
          : ""
      }
    `;
    board.appendChild(div);
  });
}

setInterval(loadEntries, 5000);
loadEntries();