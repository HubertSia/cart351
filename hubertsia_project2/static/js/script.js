document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".choices button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.id;

      fetch("/submit_choice", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(
            `You chose the ${choice}! Your choice has been recorded.\n\nCollective Totals:\nForest: ${data.data.forest}\nVillage: ${data.data.village}`
          );
        })
        .catch((err) => console.error(err));
    });
  });
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

updateBackgroundFromData();

setInterval(updateBackgroundFromData, 10000);
