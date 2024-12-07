function tournament(players) {
  document.body.classList.add("body-style");

  // Create the main container
  const flexContainer = document.createElement("div");
  // clear the body from the previous elements
  document.body.innerHTML = "";
  // let flexchecker = document.getElementsByClassName('flex-container');
  // let flexchecker2 = document.getElementsByClassName('flex-container-finale');
  // if(flexchecker.length > 0)
  // {
  //   flexchecker[0].remove();
  // }
  // if(flexchecker2.length > 0)
  // {
  //   flexchecker2[0].remove();
  // }
  flexContainer.className = "flex-container";

  //create the parent of the item1
  const item1Parent = document.createElement("div");
  item1Parent.className = "item1-parent";
  //center text
  const item1Parentspan = document.createElement("span");
  item1Parentspan.textContent = "SEMIFINAL";

  // Create the first item (item1)
  const item1Left = document.createElement("div");
  item1Left.className = "item1";

  const item1Child1 = document.createElement("div");
  item1Child1.className = "item1-child";
  item1Child1.innerHTML = `<span id="player1">${players[0][0]}</span>`;

  const item1Child2 = document.createElement("div");
  item1Child2.className = "item1-child";
  item1Child2.innerHTML = `<span id="player2">${players[0][1]}</span>`;

  // Append children to item1
  item1Left.appendChild(item1Child1);
  item1Left.appendChild(item1Child2);
  item1Parent.appendChild(item1Left);
  item1Parent.appendChild(item1Parentspan);

  // Create the second item (item2)
  const item2 = document.createElement("div");
  item2.className = "item2";

  // item2-child1 with image
  const item2Child1 = document.createElement("div");
  item2Child1.className = "item2-child1";
  const trophyImg = document.createElement("img");
  trophyImg.className = "trophy_img";
  trophyImg.src = "./src/assets/resources/trop.png";
  trophyImg.alt = "trophy";
  item2Child1.appendChild(trophyImg);

  // item2-child2 with vectors and "Final" section
  const item2Child2 = document.createElement("div");
  item2Child2.className = "item2-child2";

  const leftVectorImg = document.createElement("img");
  leftVectorImg.src = "./src/assets/resources/leftvector.png";
  leftVectorImg.alt = "leftvector";

  const finalDiv = document.createElement("div");
  finalDiv.className = "final";

  const finalSpan = document.createElement("span");
  finalSpan.textContent = "FINAL";

  const finalUpShape = document.createElement("div");
  finalUpShape.className = "final_upshape";
  if (players.length == 2) finalUpShape.innerHTML = '<span id="final1"></span>';
  else finalUpShape.innerHTML = `<span id="final1">${players[2][0]}</span>`;

  const finalDownShape = document.createElement("div");
  finalDownShape.className = "final_downshape";
  if (players.length == 2)
    finalDownShape.innerHTML = '<span id="fianl2"></span>';
  else finalDownShape.innerHTML = `<span id="fianl2">${players[2][1]}</span>`;

  // Append elements to "final" section
  finalDiv.appendChild(finalSpan);
  finalDiv.appendChild(finalUpShape);
  finalDiv.appendChild(finalDownShape);

  const rightVectorImg = document.createElement("img");
  rightVectorImg.src = "./src/assets/resources/rightvector.png";
  rightVectorImg.alt = "rightvector";

  // Append items to item2-child2
  item2Child2.appendChild(leftVectorImg);
  item2Child2.appendChild(finalDiv);
  item2Child2.appendChild(rightVectorImg);

  // item2-child3 with quote image
  const item2Child3 = document.createElement("div");
  item2Child3.className = "item2-child3";
  const quoteImg = document.createElement("img");
  quoteImg.src = "./src/assets/resources/quote.png";
  quoteImg.alt = "quote";
  item2Child3.appendChild(quoteImg);

  // Append children to item2
  item2.appendChild(item2Child1);
  item2.appendChild(item2Child2);
  item2.appendChild(item2Child3);

  //create the parent of the item3
  const item3Parent = document.createElement("div");
  item3Parent.className = "item3-parent";
  //center text
  const item3Parentspan = document.createElement("span");
  item3Parentspan.textContent = "SEMIFINAL";

  // Create the third item (item1 with right alignment)
  const item1Right = document.createElement("div");
  item1Right.className = "item1 rightdiv";

  const item1ChildReverse1 = document.createElement("div");
  item1ChildReverse1.className = "item1-child-reverse";
  item1ChildReverse1.innerHTML = `<span id="player3">${players[1][0]}</span>`;

  const item1ChildReverse2 = document.createElement("div");
  item1ChildReverse2.className = "item1-child-reverse";
  item1ChildReverse2.innerHTML = `<span id="player4">${players[1][1]}</span>`;

  // Append children to the right item1
  item1Right.appendChild(item1ChildReverse1);
  item1Right.appendChild(item1ChildReverse2);
  item3Parent.appendChild(item1Right);
  item3Parent.appendChild(item3Parentspan);

  // Append all main items to flexContainer
  flexContainer.appendChild(item1Parent);
  // flexContainer.appendChild(item1Left);
  flexContainer.appendChild(item2);
  // flexContainer.appendChild(item1Right);
  flexContainer.appendChild(item3Parent);

  // Append the container to the body or another container
  document.body.appendChild(flexContainer);
}

function finaltournament() {
  const flexContainer = document.createElement("div");
  flexContainer.className = "flex-container";

  // Create the second item (item2)
  const item2 = document.createElement("div");
  item2.className = "item2";

  // item2-child1 with image
  const item2Child1 = document.createElement("div");
  item2Child1.className = "item2-child1";
  const trophyImg = document.createElement("img");
  trophyImg.className = "trophy_img";
  trophyImg.src = "./src/assets/resources/trop.png";
  trophyImg.alt = "trophy";
  item2Child1.appendChild(trophyImg);

  // item2-child2 with vectors and "Final" section
  const item2Child2 = document.createElement("div");
  item2Child2.className = "item2-child2";

  const finalDiv = document.createElement("div");
  finalDiv.className = "final";

  const finalSpan = document.createElement("span");
  finalSpan.textContent = "FINAL";

  const finalUpShape = document.createElement("div");
  finalUpShape.className = "final_upshape";
  finalUpShape.innerHTML = '<span id="final1"></span>';

  const finalDownShape = document.createElement("div");
  finalDownShape.className = "final_downshape";
  finalDownShape.innerHTML = '<span id="fianl2"></span>';

  // Append elements to "final" section
  finalDiv.appendChild(finalSpan);
  finalDiv.appendChild(finalUpShape);
  finalDiv.appendChild(finalDownShape);

  // Append items to item2-child2
  item2Child2.appendChild(finalDiv);

  // item2-child3 with quote image
  const item2Child3 = document.createElement("div");
  item2Child3.className = "item2-child3";
  const quoteImg = document.createElement("img");
  quoteImg.src = "./src/assets/resources/quote.png";
  quoteImg.alt = "quote";
  item2Child3.appendChild(quoteImg);

  // Append children to item2
  item2.appendChild(item2Child1);
  item2.appendChild(item2Child2);
  item2.appendChild(item2Child3);

  // Append all main items to flexContainer
  flexContainer.appendChild(item2);

  // Append the container to the body or another container
  document.body.appendChild(flexContainer);
}

function OneVsOne(players) {
  document.body.classList.add("body-style");

  const flexContainer = document.createElement("div");
  flexContainer.className = "flex-container-finale";
  // clear the body from the previous elements
  document.body.innerHTML = "";
  // let flexchecker = document.getElementsByClassName('flex-container');
  // let flexchecker2 = document.getElementsByClassName('flex-container-finale');
  // if (flexchecker.length > 0) {
  //   flexchecker[0].remove();
  // }
  // if (flexchecker2.length > 0) {
  //   flexchecker2[0].remove();
  // }
  const firstdiv = document.createElement("div");
  firstdiv.className = "firstdiv-finale";
  const item1 = document.createElement("span");
  item1.textContent = `${players[0]}`.toUpperCase();
  item1.id = "player1";
  const img = document.createElement("img");
  img.src = "./src/assets/resources/vs.png";
  img.alt = "vs";
  const item2 = document.createElement("span");
  item2.textContent = `${players[1]}`.toUpperCase();
  item2.id = "player2";

  firstdiv.appendChild(item1);
  firstdiv.appendChild(img);
  firstdiv.appendChild(item2);
  const lastdiv = document.createElement("div");
  lastdiv.className = "lastdiv-finale";
  const quote = document.createElement("img");
  quote.src = "./src/assets/resources/quote.png";
  quote.alt = "quote";
  lastdiv.appendChild(quote);

  flexContainer.appendChild(firstdiv);
  flexContainer.appendChild(lastdiv);

  document.body.appendChild(flexContainer);
}
function namesForms() {
  document.body.classList.add("body-style");
  return new Promise((resolve, reject) => {
    const flexContainer = document.createElement("div");
    flexContainer.className = "flex-container-names";

    const title = document.createElement("h1");
    title.textContent = "TYPE THE PLAYERS NAMES";
    flexContainer.appendChild(title);

    const form = document.createElement("form");
    form.className = "form";

    ["Player 1", "Player 2", "Player 3", "Player 4"].forEach((labelText, i) => {
      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group-mine";

      const label = document.createElement("label");
      label.textContent = labelText;
      label.setAttribute("for", `player${i + 1}`);

      const input = document.createElement("input");
      input.type = "text";
      input.id = `player${i + 1}`;
      input.name = `player${i + 1}`;
      input.required = true;

      inputGroup.appendChild(label);
      inputGroup.appendChild(input);
      form.appendChild(inputGroup);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    const span = document.createElement("span");
    span.textContent = "START";
    submitButton.appendChild(span);

    // Event listener for form submission
    submitButton.addEventListener("click", () => {
      const players = [1, 2, 3, 4].map(
        (num) => document.getElementById(`player${num}`).value
      );
      let msg = document.getElementById("error-msg");
      if (!msg) {
        msg = document.createElement("p");
        msg.id = "error-msg";
        msg.style.color = "red";
        msg.style.textAlign = "center";
        msg.style.margin = "0";
        form.appendChild(msg);
      }

      // Validation logic
      if (players.some((player) => player === "")) {
        msg.textContent = "Please fill all the fields";
      } else if (players.length !== new Set(players).size) {
        msg.textContent = "Please enter unique names";
      } else if (
        players.some(
          (player) => player.length > 8 || !player.match(/^[A-Za-z]+$/)
        )
      ) {
        msg.textContent =
          "Please enter a valid name (only letters and max 8 characters)";
      } else {
        msg.textContent = ""; // Clear any error messages
        flexContainer.remove(); // Remove the form from the DOM
        resolve(players); // Resolve the Promise with the players array
        waiting_for_response();
      }
    });

    form.appendChild(submitButton);
    flexContainer.appendChild(form);
    document.body.appendChild(flexContainer);
  });
}

function waiting_for_response() {
  const flexContainer = document.createElement("div");
    flexContainer.className = "flex-container-names2";

  const tick = document.createElement("div");
  const dii = document.createElement("div");
  dii.className = "loading-animation__list-wrapper";


  tick.className = "loading-animation__tick";
  dii.appendChild(tick);

  const list = document.createElement("ul");
  list.className = "loading-animation__list";

  const items = [
    "Sending request to backend...",
    "Connecting to blockchain...",
    "Awaiting response from server...",
    "Processing data...",
    "Finalizing tournament setup...",
    "Almost there..."
  ];

  items.forEach(text => {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    list.appendChild(listItem);
  });

  dii.appendChild(list);
  flexContainer.appendChild(dii);

  document.body.appendChild(flexContainer);
}
export { tournament, finaltournament, OneVsOne, namesForms , waiting_for_response};
// namesForms();
// OneVsOne();
// tournament();
// finaltournament();
