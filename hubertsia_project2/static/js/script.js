// --- Utility: Typewriter Effect ---
function typeWriterEffect(element, text, speed = 30, callback) {
  
  // Clears any existing text in the element before typing starts
  element.textContent = "";
  
  // Makes sure the element is visible (it starts hidden in CSS)
  element.style.visibility = "visible";
  
  // Tracks the current position while typing
  let i = 0;

  // Recursive inner function that adds one character at a time
  function type() {
    
    // Still characters left to print
    if (i < text.length) {
      
      // Add next character
      element.textContent += text.charAt(i);
      i++;
      
      // Wait 'speed' milliseconds before typing next character and call back when done
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
      
      // Send the choice to the Flask backend as JSON
      fetch("/submit_choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      })
        
        // Parse JSON response
        .then((res) => res.json())
        .then(() => {
          
          // After recording the choice, redirect to the proper scene
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
            
            // Default catch‑all (rarely used)
            window.location.href = `/${choice}`;
          }
        })
        
        // Logs network or backend errors, if any
        .catch((err) => console.error("Error sending choice:", err));
    });
  });

    // Finds the "See results" button by ID to go to the result page
  const resultsBtn = document.getElementById("view-results");
  if (resultsBtn) {
    
    resultsBtn.onclick = () => {
      window.location.href = "/results";
    };
  }

    // Finds the "Return" button by ID to go back to the previous page
  const returnBtn = document.getElementById("return");
  if (returnBtn) {
    returnBtn.onclick = () => (window.location.href = "/");
  }

  
    // Finds a special "Enter Tavern" button by ID, goes to the tavern
  const enterTavernBtn = document.getElementById("enter-tavern");
  if (enterTavernBtn) {
    enterTavernBtn.onclick = () => {
      fetch("/submit_choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: "tavern" }),
      })
        
        // Record the tavern and show it to the tavern page
        .then((res) => res.json())
        .then(() => (window.location.href = "/tavern"))
        
        // Handle any errors
        .catch((err) => console.error("Error submitting tavern:", err));
    };
  }

  // ---- Typewriter sequence -----
  
    // Selects all paragraphs within the <main> section of the page
  const paragraphs = document.querySelectorAll("main p");
  
    // Keeps track of which paragraph index is currently being typed
  let index = 0;
  
    // Hides all paragraphs before typewriter animation starts
  paragraphs.forEach((el) => (el.style.visibility = "hidden"));

  
    // Function to type one paragraph, then call itself for the next one
  function typeNext() {
    
    
    // Still paragraphs left to type. Save the full original text and clear the paragraph text so we can “type” it back in
    if (index < paragraphs.length) {
      const el = paragraphs[index];
      const text = el.textContent.trim();
      el.textContent = "";
      
      
       // Start typing the current paragraph
      // When finished, increase index and type the next paragraph
      typeWriterEffect(el, text, 25, () => {
        index++;
        typeNext();
      });
    }
  }
  // Begin the text typing for the first paragraph
  typeNext();
});