/* PLEASE DO NOT CHANGE THIS FRAMEWORK ....
the get requests are all implemented and working ... 
so there is no need to alter ANY of the existing code: 
rather you just ADD your own ... */

window.onload = function () {
  document.querySelector("#queryChoice").selectedIndex = 0;
  //create once :)
  let description = document.querySelector("#Ex4_title");
  //array to hold the dataPoints
  let dataPoints = [];

  // /**** GeT THE DATA initially :: default view *******/
  // /*** no need to change this one  **/
  runQueryDefault("onload");

  /***** Get the data from drop down selection ****/
  let querySelectDropDown = document.querySelector("#queryChoice");

  querySelectDropDown.onchange = function () {
    console.log(this.value);
    let copyVal = this.value;
    console.log(copyVal);
    runQuery(copyVal);
  };

  /******************* RUN QUERY***************************  */
  async function runQuery(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);

      //reset the
      document.querySelector("#childOne").innerHTML = "";
      description.textContent = "";
      document.querySelector("#parent-wrapper").style.background =
        "rgba(51,102,255,.2)";

      switch (queryPath) {
        case "default": {
          displayAsDefault(resJSON);
          break;
        }
        case "one": {
          //sabine done
          displayInCirclularPattern(resJSON);
          break;
        }
        case "two": {
          //sabine done
          displayByGroups(resJSON, "weather", "eventName");
          break;
        }
        /***** TO DO FOR EXERCISE 4 *************************
         ** 1: Once you have implemented the mongodb query in server.py,
         ** you will receive it from the get request (THE FETCH HAS ALREADY BEEN IMPLEMENTED:: SEE ABOVE) 
         ** and will automatically will enter into the correct select case
         **  - based on the value that the user chose from the drop down list...)
         ** You need to design and call a custom display function FOR EACH query that you construct ...
         ** 4 queries - I want 4 UNIQUE display functions - you can use the ones I created
         ** as inspiration ONLY - DO NOT just copy and change colors ... experiment, explore, change ...
         ** you can create your own custom objects - but NO images, video or sound... (will get 0).
         ** bonus: if your visualizations(s) are interactive or animate.
         ****/
        case "three": {
          console.log("three");
          displayPositiveMoods(resJSON);
          break;
        }
        case "four": {
          console.log("four")
          displayByEventName(resJSON);
          break;
        }

        case "five": {
          console.log("five")
          displayByAffectStrength(resJSON);
          break;
        }
        case "six": {
          console.log("six")
          displayNegativeWeather(resJSON);
          break;
        }
        default: {
          console.log("default case");
          break;
        }
      } //switch
    } catch (err) {
      console.log(err);
    }
  }
  //will make a get request for the data ...

  /******************* RUN DEFAULT QUERY***************************  */
  async function runQueryDefault(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);
      displayAsDefault(resJSON);
    } catch (err) {
      console.log(err);
    }
  }
  /*******************DISPLAY AS GROUP****************************/

  function displayByGroups(resultObj, propOne, propTwo) {
    dataPoints = [];
    let finalHeight = 0;
    //order by WEATHER and Have the event names as the color  ....

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(51, 153, 102,1)";
    description.textContent = "BY WEATHER AND ALSO HAVE EVENT NAMES {COLOR}";
    description.style.color = "rgb(179, 230, 204)";

    let coloredEvents = {};
    let resultSet = resultObj.results;

    //reget
    let possibleEvents = resultObj.events;
    let possibleColors = [
      "rgb(198, 236, 217)",
      "rgb(179, 230, 204)",
      "rgb(159, 223, 190)",
      "rgb(140, 217, 177)",
      "rgb(121, 210, 164)",
      "rgb(102, 204, 151)",
      "rgb(83, 198, 138)",
      "rgb(64, 191, 125)",
      "rgb(255, 204, 179)",
      "rgb(255, 170, 128)",
      "rgb(255, 153, 102)",
      "rgb(255, 136, 77)",
      "rgb(255, 119, 51)",
      "rgb(255, 102, 26)",
      "rgb(255, 85, 0)",
      "rgb(230, 77, 0)",
      "rgb(204, 68, 0)",
    ];

    for (let i = 0; i < possibleColors.length; i++) {
      coloredEvents[possibleEvents[i]] = possibleColors[i];
    }

    let offsetX = 20;
    let offsetY = 150;
    // find the weather of the first one ...
    let currentGroup = resultSet[0][propOne];
    console.log(currentGroup);
    let xPos = offsetX;
    let yPos = offsetY;

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the EVENT ...
          coloredEvents[resultSet[i].event_name],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );

      /** check if we have changed group ***/
      if (resultSet[i][propOne] !== currentGroup) {
        //update
        currentGroup = resultSet[i][propOne];
        offsetX += 150;
        offsetY = 150;
        xPos = offsetX;
        yPos = offsetY;
      }
      // if not just keep on....
      else {
        if (i % 10 === 0 && i !== 0) {
          xPos = offsetX;
          yPos = yPos + 15;
        } else {
          xPos = xPos + 15;
        }
      } //end outer else

      dataPoints[i].update(xPos, yPos);
      finalHeight = yPos;
    } //for

    document.querySelector("#childOne").style.height = `${finalHeight + 20}px`;
  } //function

  /*****************DISPLAY IN CIRCUlAR PATTERN:: <ONE>******************************/
  function displayInCirclularPattern(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    //for circle drawing
    let angle = 0;
    let centerX = window.innerWidth / 2;
    let centerY = 350;

    let scalar = 300;
    let yHeight = Math.cos(angle) * scalar + centerY;

    let resultSet = resultOBj.results;
    let coloredMoods = {};

    let possibleMoods = resultOBj.moods;
    let possibleColors = [
      "rgba(0, 64, 255,.5)",
      "rgba(26, 83, 255,.5)",
      "rgba(51, 102, 255,.7)",
      "rgba(51, 102, 255,.4)",
      "rgba(77, 121,255,.6)",
      "rgba(102, 140, 255,.6)",
      "rgba(128, 159, 255,.4)",
      "rgba(153, 179, 255,.3)",
      "rgba(179, 198, 255,.6)",
      "rgba(204, 217, 255,.4)",
    ];

    for (let i = 0; i < possibleMoods.length; i++) {
      coloredMoods[possibleMoods[i]] = possibleColors[i];
    }

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(0, 26, 102,1)";
    description.textContent = "BY AFTER MOOD";
    description.style.color = "rgba(0, 64, 255,.5)";

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the day ...
          coloredMoods[resultSet[i].after_mood],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );
      /*** circle drawing ***/
      xPos = Math.sin(angle) * scalar + centerX;
      yPos = Math.cos(angle) * scalar + centerY;
      angle += 0.13;

      if (angle > 2 * Math.PI) {
        angle = 0;
        scalar -= 20;
      }
      dataPoints[i].update(xPos, yPos);
    } //for

    document.querySelector("#childOne").style.height = `${yHeight}px`;
  } //function

  /*****************DISPLAY AS DEFAULT GRID :: AT ONLOAD ******************************/
  function displayAsDefault(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    const NUM_COLS = 50;
    const CELL_SIZE = 20;
    let coloredDays = {};
    let resultSet = resultOBj.results;
    possibleDays = resultOBj.days;
    /*
  1: get the array of days (the second entry in the resultOBj)
  2: for each possible day (7)  - create a key value pair -> day: color and put in the
  coloredDays object
  */
    console.log(possibleDays);
    let possibleColors = [
      "rgb(255, 102, 153)",
      "rgb(255, 77, 136)",
      "rgb(255, 51, 119)",
      "rgb(255, 26, 102)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
    ];

    for (let i = 0; i < possibleDays.length; i++) {
      coloredDays[possibleDays[i]] = possibleColors[i];
    }
/* for through each result
1: create a new MyDataPoint object and pass the properties from the db result entry to the object constructor
2: set the color using the coloredDays object associated with the resultSet[i].day
3:  put into the dataPoints array.
**/
    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(255,0,0,.4)";
    description.textContent = "DEfAULT CASE";
    description.style.color = "rgb(255, 0, 85)";

    //last  element is the helper array...
    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].evnet_name,
          //map to the day ...
          coloredDays[resultSet[i].day],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point"
        )
      );

      /** this code is rather brittle - but does the job for now .. draw a grid of data points ..
//*** drawing a grid ****/
      if (i % NUM_COLS === 0) {
        //reset x and inc y (go to next row)
        xPos = 0;
        yPos += CELL_SIZE;
      } else {
        //just move along in the column
        xPos += CELL_SIZE;
      }
      //update the position of the data point...
      dataPoints[i].update(xPos, yPos);
    } //for
    document.querySelector("#childOne").style.height = `${yPos + CELL_SIZE}px`;
  } //function

  /***********************************************/
};

/************************* THREE: POSITIVE AFTER-MOODS *************************/
function displayPositiveMoods(resultObj) {
  // Arrays to store generated data point objects
  let dataPoints = [];

  // Unpack relevant fields from the input result object
  let resultSet = resultObj.results;
  let possibleMoods = resultObj.moods;

  // Grab essential DOM elements
  const container = document.querySelector("#childOne");
  const description = document.querySelector("#Ex4_title");
  const parent = document.querySelector("#parent-wrapper");

  // Set up the visual style of the parent background and title
  parent.style.background = "rgba(173, 216, 230,.3)";
  description.textContent = "POSITIVE AFTER‑MOODS";
  description.style.color = "#0077b6";

  // Assign a unique color to each possible mood
  let moodColors = {};
  let colors = ["#a0e7e5", "#b4f8c8", "#fbe7c6", "#ffaecc", "#ffc75f"];
  for (let i = 0; i < possibleMoods.length; i++) {
    // Cycle through the colors list, wrapping around using modulo
    moodColors[possibleMoods[i]] = colors[i % colors.length];
  }

  // Base coordinates and spacing for point placement
  let xBase = 100;
  let yBase = 100;
  let columnSpacing = 50;

  // Loop through all data results and create a visual data point for each
  for (let i = 0; i < resultSet.length; i++) {
    const r = resultSet[i];
    let color = moodColors[r.after_mood];

    // Create a new myDataPoint instance using the mood's data
    let dp = new myDataPoint(
      r.dataId,
      r.day,
      r.weather,
      r.start_mood,
      r.after_mood,
      r.after_mood_strength,
      r.event_affect_strength,
      r.event_name,
      color,
      container,
      "point_two"
    );

    // Determine initial coordinates — horizontally spaced, vertically tied to strength
    let x = xBase + (i % possibleMoods.length) * columnSpacing;
    let y = yBase + r.after_mood_strength * 15;

    // Render to canvas or DOM at calculated position
    dp.update(x, y);
    dataPoints.push(dp);
  }

  // Define bounds for bouncing movement (screen limits)
  const bounds = {
    minX: 50,
    maxX: window.innerWidth - 100,
    minY: 80,
    maxY: 550,
  };

  // Each point gets a small random velocity for organic motion
  let velocities = dataPoints.map(() => ({
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));

  // Animation loop: moves and bounces the points around the area
  function animateBouncing() {
    for (let i = 0; i < dataPoints.length; i++) {
      let dp = dataPoints[i];
      let v = velocities[i];

      // Update position based on velocity
      dp.x += v.vx;
      dp.y += v.vy;

      // Bounce horizontally or vertically when hitting screen bounds
      if (dp.x < bounds.minX || dp.x > bounds.maxX) v.vx *= -1;
      if (dp.y < bounds.minY || dp.y > bounds.maxY) v.vy *= -1;

      dp.update(dp.x, dp.y);

      // Change brightness subtly depending on movement speed
      let speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
      dp.container.style.filter = `brightness(${100 + speed * 50}%)`;
    }

    // Continue the animation
    requestAnimationFrame(animateBouncing);
  }

  // Start the animation
  animateBouncing();
}

/************************* FOUR: EVENT NAME ORBIT *************************/
function displayByEventName(resultObj) {
  let dataPoints = [];
  let resultSet = resultObj.results;
  let events = resultObj.events;

  const parent = document.querySelector("#parent-wrapper");
  const container = document.querySelector("#childOne");
  const description = document.querySelector("#Ex4_title");

  // Set theme visuals for this display mode
  parent.style.background = "rgba(255, 255, 204,.3)";
  description.textContent = "BY EVENT NAME";
  description.style.color = "#ff6600";

  // Assign color to each event name
  let eventColors = {};
  let colorSet = [
    "#ffb6b9",
    "#fae3d9",
    "#bbded6",
    "#8ac6d1",
    "#c2f970",
    "#deaaff",
    "#ff99c8",
    "#fcf6bd",
    "#d0f4de",
    "#a9def9",
    "#e4c1f9",
  ];
  for (let i = 0; i < events.length; i++) {
    eventColors[events[i]] = colorSet[i % colorSet.length];
  }

  // Define the center of rotation and orbit radius
  let CX = window.innerWidth / 2;
  let CY = 350;
  let radius = 250;

  // Create a circular set of data points with colors by event
  for (let i = 0; i < resultSet.length; i++) {
    let ev = resultSet[i];
    let color = eventColors[ev.event_name];
    let dp = new myDataPoint(
      ev.dataId,
      ev.day,
      ev.weather,
      ev.start_mood,
      ev.after_mood,
      ev.after_mood_strength,
      ev.event_affect_strength,
      ev.event_name,
      color,
      container,
      "point_two"
    );
    dataPoints.push(dp);
  }

  // Animation loop: rotates points around the center
  let frame = 0;
  function spin() {
    frame += 0.01; // controls rotation speed
    for (let i = 0; i < dataPoints.length; i++) {
      // Evenly distribute points on a circle
      let angle = frame + (i * 2 * Math.PI) / dataPoints.length;
      let x = CX + Math.cos(angle) * radius;
      let y = CY + Math.sin(angle) * radius;
      dataPoints[i].update(x, y);
    }
    requestAnimationFrame(spin);
  }

  spin();
}

/************************* FIVE: AFFECT STRENGTH BARS *************************/
function displayByAffectStrength(resultObj) {
  let dataPoints = [];
  let resultSet = resultObj.results;
  const parent = document.querySelector("#parent-wrapper");
  const container = document.querySelector("#childOne");
  const description = document.querySelector("#Ex4_title");

  parent.style.background = "rgba(255,230,255,.3)";
  description.textContent = "Mon/Tue — Event Affect Strength";
  description.style.color = "#7209b7";

  // Different color per day
  let colors = { Monday: "#4cc9f0", Tuesday: "#b5179e" };

  // Layout variables
  let yGap = 10;
  let startX = 50;

  // Create horizontal bars representing event affect strength
  for (let i = 0; i < resultSet.length; i++) {
    let r = resultSet[i];
    let dp = new myDataPoint(
      r.dataId,
      r.day,
      r.weather,
      r.start_mood,
      r.after_mood,
      r.after_mood_strength,
      r.event_affect_strength,
      r.event_name,
      colors[r.day],
      container,
      "point_two"
    );

    // Position in vertical order (Mon/Tue stacked)
    let baseY = 50 + i * yGap;
    let targetX = startX + r.event_affect_strength * 40;

    // Start from baseline X and expand outward (simple animation)
    dp.update(startX, baseY);
    dataPoints.push(dp);

    // Gradually animate the bar growing
    setTimeout(() => dp.update(targetX, baseY), i * 20);
  }
}

/************************* SIX: NEGATIVE MOODS SPIRAL *************************/
function displayNegativeWeather(resultObj) {
  let dataPoints = [];
  let resultSet = resultObj.results;
  const parent = document.querySelector("#parent-wrapper");
  const container = document.querySelector("#childOne");
  const description = document.querySelector("#Ex4_title");

  parent.style.background = "rgba(10,10,10,.7)";
  description.textContent = "DOUBLE‑NEGATIVE WEATHER SPIRAL";
  description.style.color = "rgb(200,200,255)";

  // Define the center point for the spiral animation
  let CX = window.innerWidth / 2;
  let CY = 400;

  // Create data points with hue variations (rainbow spiral effect)
  for (let i = 0; i < resultSet.length; i++) {
    let r = resultSet[i];
    let color = `hsl(${(i * 15) % 360}, 70%, 60%)`;
    let dp = new myDataPoint(
      r.dataId,
      r.day,
      r.weather,
      r.start_mood,
      r.after_mood,
      r.after_mood_strength,
      r.event_affect_strength,
      r.event_name,
      color,
      container,
      "point_two"
    );
    dataPoints.push(dp);
  }

  // Spiral movement animation
  let frame = 0;
  function animateSpiral() {
    frame++;
    for (let i = 0; i < dataPoints.length; i++) {
      // Calculate polar coordinates to make a spiral pattern
      let angle = 0.25 * i + frame * 0.02;
      let r = 50 + i * 2 + Math.sin(frame * 0.02 + i) * 5;
      let x = CX + Math.cos(angle) * r;
      let y = CY + Math.sin(angle) * r;

      dataPoints[i].update(x, y);

      // Animate brightness pulsing over time
      let brightness = 50 + 30 * Math.sin(frame * 0.05 + i);
      dataPoints[i].container.style.filter = `brightness(${brightness}%)`;
    }

    requestAnimationFrame(animateSpiral);
  }

  animateSpiral();
}