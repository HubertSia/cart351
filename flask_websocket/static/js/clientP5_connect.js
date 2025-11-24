let flowers = [];
let state = "waiting";
let clientSocket = null;

function createDisButton(){
    let b = document.createElement("div");
    b.setAttribute("id","d-button");
    b.innerHTML = "DISCONNECT"
    document.querySelector("main").prepend(b);
}

window.onload = function () {
  document.querySelector("#c-button").addEventListener("click", goConnect);
};

function goConnect() {
  // this is the CONNECT button div
  // document.querySelector("#c-button").style.display = "none";
  this.remove();
  createDisButton();

  document.querySelector(".username-container").style.display = "block";

  console.log("loaded");
  let uName = "";
  let io_client = io(); // js library
  clientSocket = io_client;
  console.log(clientSocket);

  document.querySelector("#uButton").addEventListener("click", function () {
    uName = document.querySelector("#uName").value;
    console.log(uName);
    clientSocket.emit("join", uName); // Notify server of new user
  });

  clientSocket.on("join-complete", function () {
    document.querySelector(".username-container").style.display = "none";
    document.querySelector("#p5Test").style.display = "block";
    state = "active";
  });

  clientSocket.on("flowerFromServer", function (flowerData) {
    let tempFlower = new Flower(
      flowerData.x,
      flowerData.y,
      flowerData.o_color.levels,
      flowerData.i_color.levels,
      flowerData.scalar
    );
    flowers.push(tempFlower);
  });

  document
    .querySelector("#d-button")
    .addEventListener("click", function () {
      console.log("disconnected");
      this.remove();
      clientSocket.disconnect();
      // reload window - option
      window.location.reload(true);
    });
}

/*************************p5*********************************** */
let clientScopeFlowerCol = {};
function setup() {
  let canvas = createCanvas(800,600);
  canvas.parent("p5Container");
  background(0);
  textSize(22);
  clientScopeFlowerCol.outerCol = color(random(255), random(255), random(255));
  clientScopeFlowerCol.innerCol = color(random(255), random(255), random(255));
  clientScopeFlowerCol.scalar = random(10,60);
}
function draw() {
  background(0);
  if (state === "active") {
    for (let i = 0; i < flowers.length; i++) {
      flowers[i].drawFlower();
      flowers[i].scaleFlower();
    }
  }
}
function mousePressed() {
  if (state === "active") {
    let tempFlower = new Flower(
      mouseX,
      mouseY,
      clientScopeFlowerCol.outerCol,
      clientScopeFlowerCol.innerCol,
      clientScopeFlowerCol.scalar
    );
    flowers.push(tempFlower);
    clientSocket.emit("newFlower", tempFlower);
  }
}