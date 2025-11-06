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