// --- Utility: Typewriter Effect ---
function typeWriterEffect(element, text, speed = 30, callback) {
  element.textContent = "";
  element.style.visibility = "visible";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

// --- Main application logic ---
document.addEventListener("DOMContentLoaded", () => {
  // Handle all choice buttons
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

  const resultsBtn = document.getElementById("view-results");
  if (resultsBtn) {
    resultsBtn.onclick = () => {
      window.location.href = "/results";
    };
  }

  const returnBtn = document.getElementById("return");
  if (returnBtn) {
    returnBtn.onclick = () => (window.location.href = "/");
  }

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

  // Typewriter sequence
  const paragraphs = document.querySelectorAll("main p");
  let index = 0;
  paragraphs.forEach((el) => (el.style.visibility = "hidden"));

  function typeNext() {
    if (index < paragraphs.length) {
      const el = paragraphs[index];
      const text = el.textContent.trim();
      el.textContent = "";
      typeWriterEffect(el, text, 25, () => {
        index++;
        typeNext();
      });
    }
  }

  typeNext();
});