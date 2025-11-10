window.onload = function () {
  console.log("search script loaded");

  document.querySelector("#searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("search form submitted");

    let formData = new FormData(document.querySelector("#searchForm"));
    const queryString = new URLSearchParams(formData).toString();

    fetch("passToFlask?" + queryString)
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        // ✅ Call here to render the results after the response arrives
        displayResponse(jsonData["test-response"]);
      })
      .catch((err) => console.error(err));
  });
};

// helper function to show search results
function displayResponse(theResult) {
  document.querySelector("#result").innerHTML = "";
  let back = document.createElement("div");
  back.id = "back";
  let title = document.createElement("h3");
  title.textContent = "Results from user";
  document.querySelector("#result").appendChild(title);
  document.querySelector("#result").appendChild(back);

  for (let i = 0; i < theResult.length; i++) {
    let container = document.createElement("div");
    container.classList.add("outer");
    back.appendChild(container);

    let contentContainer = document.createElement("div");
    contentContainer.classList.add("content");
    container.appendChild(contentContainer);

    for (let property in theResult[i]) {
      if (property !== "imagePath" && property !== "birthDate") {
        let para = document.createElement("p");
        para.textContent = property + ": " + theResult[i][property];
        contentContainer.appendChild(para);
      }
      if (property === "birthDate") {
        let para = document.createElement("p");
        let options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        let date = new Date(theResult[i][property]["$date"]);
        para.textContent =
          property + ": " + date.toLocaleDateString("en-US", options);
        contentContainer.appendChild(para);
      }
    }

    let img = document.createElement("img");
    img.setAttribute("src", "../static/" + theResult[i]["imagePath"]);
    container.appendChild(img);
  }
}