document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".choices button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.id;

      fetch("/submit_choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      })
        .then((res) => res.json())
        .then(() => {
          if (choice === "forest" || choice === "village") {
            window.location.href = `/${choice}`;
          } else if (choice === "follow-sound" || choice === "investigate") {
            window.location.href = "/forest_investigate";
          } else if (choice === "tame_wolf") {
            window.location.href = "/wolf_tame";
          } else if (choice === "scare_wolf") {
            window.location.href = "/wolf_scare";
          } else if (choice === "enter-tavern" || choice === "tavern") {
            window.location.href = "/tavern";
          } else if (choice === "walk-home" || choice === "walkaway") {
            window.location.href = "/ending_walkaway";
          } else if (choice === "throw" || choice === "throw-something") {
            window.location.href = "/ending_throw";
          } else if (choice === "talk" || choice === "talk-them") {
            window.location.href = "/ending_talk";
          } else if (choice === "return") {
            window.location.href = "/";
          } else {
            window.location.href = `/${choice}`;
          }
        })
        .catch((err) => console.error("Error sending choice:", err));
    });
  });

  const returnBtn = document.getElementById("return");
  if (returnBtn) returnBtn.onclick = () => (window.location.href = "/");

  const enterTavernBtn = document.getElementById("enter-tavern");
  if (enterTavernBtn) {
    enterTavernBtn.onclick = () => {
      fetch("/submit_choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: "tavern" }),
      })
        .then((res) => res.json())
        .then(() => (window.location.href = "/tavern"))
        .catch((err) => console.error("Error submitting tavern:", err));
    };
  }

  updateBackgroundFromData();
  setInterval(updateBackgroundFromData, 10000);
});


function updateBackgroundFromData() {
  fetch("/get_data")
    .then((res) => res.json())
    .then((data) => {
      const forest = data.forest || 0;
      const village = data.village || 0;
      document.body.classList.remove("forest-mode", "village-mode");

      if (forest > village) {
        document.body.classList.add("forest-mode");
      } else if (village > forest) {
        document.body.classList.add("village-mode");
      }
    })
    .catch((err) => console.error("Error fetching data:", err));
}