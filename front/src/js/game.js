import * as tournamentFile from "./tournement.js";
export function initGamePage(mode) {

 function game(mode) {
    let gametype = "local";
    let gameMode = "player";
    let difficulty = "easy";
    let socket;
    if (mode === "local") {
      gametype = "local";
      gameMode = "player";
    } else if (mode === "bot") {
      gametype = "local";
      gameMode = "bot";
    } else if (mode === "remote") {
      gametype = "remote";
    } else if (mode === "tournament") {
      gametype = "tournament";
    }

    firstwindow();
    function gameOver(winner) {
      console.log("winner", winner);
      if (winner === "left")
        winner = document.getElementById("leftPlayerP").innerText;
      else if (winner === "right")
        winner = document.getElementById("rightPlayerP").innerText;
      else winner = winner.toUpperCase();
      let myDiv = document.getElementById("myDiv");
      myDiv.remove();
      socket.close();
      // window.cancelAnimationFrame(draw);
      // window.removeEventListener('resize', sendNewSize);
      // window.removeEventListener('keyup', handleKeyEvent);
      // window.removeEventListener('keydown', handleKeyEvent);

      let win_dow = document.createElement("div");
      win_dow.id = "gameover-window";
      let div = document.createElement("div");
      div.id = "gameOver";
      let h1 = document.createElement("h1");
      h1.innerText = "GAME-OVER";
      win_dow.appendChild(h1);
      let p = document.createElement("h2");
      p.innerText = winner.toUpperCase() + " WIN";
      div.appendChild(p);
      let img = document.createElement("img");
      img.src = "./src/assets/resources/trophy.svg";
      img.alt = "trophy";
      div.appendChild(img);
      win_dow.appendChild(div);
      let inDiv = document.createElement("div");
      inDiv.id = "inputDiv";
      let button = document.createElement("button");
      button.id = "restart";
      let span = document.createElement("span");
      span.innerText = "Restart";
      button.appendChild(span);
      button.addEventListener("click", function () {
        win_dow.remove();
        firstwindow();
      });
      inDiv.appendChild(button);
      button = document.createElement("button");
      button.id = "exit";
      span = document.createElement("span");
      span.innerText = "GO HOME";
      button.appendChild(span);
      button.addEventListener("click", function () {
        win_dow.remove();
        firstwindow();
      });
      inDiv.appendChild(button);
      button = document.createElement("button");
      button.id = "changeMode";
      span = document.createElement("span");
      span.innerText = "Change Mode";
      button.appendChild(span);
      button.addEventListener("click", function () {
        win_dow.remove();
        firstwindow();
      });
      inDiv.appendChild(button);
      win_dow.appendChild(inDiv);
      document.body.appendChild(win_dow);
    }
    function firstwindow() {
      let div = document.createElement("div");
      div.id = "window";
      if (gametype === "local" && gameMode === "bot") {
        let inDiv = document.createElement("div");
        inDiv.id = "inDiv";
        let h1 = document.createElement("h1");
        h1.innerText = "BOT DIFFICULTY";
        div.appendChild(h1);

        const Mods = ["Easy", "Medium", "Hard"];
        Mods.forEach((mod) => {
          let button = document.createElement("button");
          button.id = mod;
          let span = document.createElement("span");
          span.innerText = mod;
          button.appendChild(span);
          button.addEventListener("click", function () {
            difficulty = mod.toLowerCase();
            div.remove();
            secondwindow();
          });
          inDiv.appendChild(button);
        });
        div.appendChild(inDiv);
        document.body.appendChild(div);
      }
      if (gametype === "local" && gameMode === "player") {
        let inDiv = document.createElement("div");
        inDiv.id = "inputDiv";
        let h1 = document.createElement("h1");
        h1.innerText = "ENTER PLAYER NAME";
        div.appendChild(h1);

        // let otherDiv = document.createElement('div');
        let input = document.createElement("input");
        input.type = "text";
        input.id = "playerName";
        input.required = true;
        input.autocomplete = "off";
        let label = document.createElement("label");
        label.for = "input";
        label.innerText = "Player Name";
        // input.placeholder = 'Enter your name';
        inDiv.appendChild(input);
        inDiv.appendChild(label);

        let button = document.createElement("button");
        button.id = "startGame";
        let span = document.createElement("span");
        span.innerText = "Start Game";
        button.appendChild(span);
        button.addEventListener("click", function () {
          let playerName = input.value.trim();
          let msg = document.getElementById("error-msg");
          if (!msg) {
            // Create a new error message element only if it doesn't exist
            msg = document.createElement("p");
            msg.style.color = "red";
            msg.id = "error-msg";
            div.appendChild(msg);
          }
          // div.appendChild(msg);
          if (playerName) {
            if (playerName.length > 8 || !playerName.match(/^[A-Za-z]+$/)) {
              msg.innerText =
                "The name must be 8 characters max and only letters";
              return;
            }
            div.remove();
            secondwindow(playerName);
          } else {
            msg.innerText = "Please enter a name";
            // alert('Please enter a name');
          }
        });
        inDiv.appendChild(button);
        div.appendChild(inDiv);
        document.body.appendChild(div);
      } else if (gametype === "remote") {
        secondwindow();
      } else if (gametype === "tournament") {
        console.log("PLOP");
        tournamentFile.namesForms().then((formData) => {
          secondwindow(formData);
        });
      }
    }
    function secondwindow(playerName) {
      let pause = false;
      let animationControle = undefined;
      function creatloadingscreen() {
        let div = document.createElement("div");
        div.id = "window";
        let h1 = document.createElement("h1");
        h1.innerText = "WAITING FOR PLAYER 2";
        div.appendChild(h1);
        let loading = document.createElement("div");
        loading.className = "spinner";
        let loadingDiv = document.createElement("div");
        loadingDiv.className = "spinner1";
        loading.appendChild(loadingDiv);
        div.appendChild(loading);
        document.body.appendChild(div);
      }

      if (gametype === "local") {
        socket = new WebSocket("ws://localhost:8001/ws/pingPong/local");
      } else if (gametype === "remote") {
        // Use backticks for string interpolation
        socket = new WebSocket("ws://localhost:8001/ws/pingPong/remote/");
      } else if (gametype === "tournament") {
        socket = new WebSocket("ws://localhost:8001/ws/pingPong/tournament/");
      }
      // const socket = new WebSocket('ws://localhost:8001/ws/pingPong/');
      let id = 0;
      socket.onopen = function (e) {
        console.log("Connection established");
        if (gametype === "remote") {
          const token = sessionStorage.getItem('jwtToken');
          console.log(id);
          socket.send(
            JSON.stringify({
              message: "Hello, server!",
              token: token,
            })
          );

          creatloadingscreen();
        } else if (gametype === "local") {
          const token = sessionStorage.getItem('jwtToken');
          if (gameMode === "bot") {
            socket.send(
              JSON.stringify({
                message: "Hello, server!",
                width: window.innerWidth,
                height: window.innerWidth,
                mode: gameMode,
                difficulty: difficulty,
                token: token,
              })
            );
          } else {
            socket.send(
              JSON.stringify({
                message: "Hello, server!",
                width: window.innerWidth,
                height: window.innerWidth,
                mode: gameMode,
                token: token,
              })
            );
          }
        } else if (gametype === "tournament") {
          socket.send(
            JSON.stringify({
              message: "Hello, server!",
              width: window.innerWidth,
              height: window.innerWidth,
              names: playerName,
            })
          );
        }
      };

      socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        //parse the data and do something with it
        if (gametype === "tournament") {
          if (data.event === "tournament") {
            console.log("begin tournament");
            let checkBoyd = document.getElementById("flex-container-names2");
            if (checkBoyd) {
              checkBoyd.remove();
            }
            tournamentFile.tournament(data.groups);
          }
          if (data.event === "OneVsOne") {
            console.log("begin OneVsOne");
            tournamentFile.OneVsOne(data.players);
            playerName[0] = data.players[0];
            playerName[1] = data.players[1];
          }
        }
        if(gametype === "remote")
        {
          if(data.message === "remote-id")
          {
            id = data.id;
            console.log("id",id);
          }
        }
        if (data.event === "draw") {

          if (gametype === "remote") {
            document.getElementById("window").remove();
          } else if (gametype === "tournament") {
            document.body.classList.remove("body-style");
            document
              .getElementsByClassName("flex-container-finale")[0]
              .remove();
          }
          gameData.width = data.canvasWidth;
          gameData.height = data.canvasHeight;
          letsStart(data);
          //    console.log('draw');
        }
        if (data.event === "gameOver") {
          console.log("gameOver");
          window.cancelAnimationFrame(animationControle);
          if (gametype === "tournament") {
            firstInstructions = true;
          }
          if (gametype === "local") {
            window.removeEventListener("resize", sendNewSize);
            window.removeEventListener("keyup", handleKeyEvent);
            window.removeEventListener("keydown", handleKeyEvent);
            gameOver(data.winner);
          } else if (gametype === "remote") {
            window.removeEventListener("resize", sendNewSize);
            window.removeEventListener("keyup", handleKeyEvent);
            window.removeEventListener("keydown", handleKeyEvent);
            gameOver(data.winner);
          }
        }
        if (data.event === "winner") {
          window.removeEventListener("resize", sendNewSize);
          window.removeEventListener("keyup", handleKeyEvent);
          window.removeEventListener("keydown", handleKeyEvent);
          gameOver(data.winner);
        }
        if (data.event === "newSize") {
          gameData.width = data.newCanvasWidth;
          gameData.height = data.newCanvasHeight;
          canvas.width = gameData.width;
          canvas.height = gameData.height;
        }
        if (data && data.ball) {
          gameData.fontSize = data.fontSize;

          gameData.heightPaddleSize = data.heightPaddleSize;
          gameData.widthPaddleSize = data.widthPaddleSize;
          gameData.xLeft = data.xLeft;
          gameData.yLeft = data.yLeft;
          gameData.xRight = data.xRight;
          gameData.yRight = data.yRight;
          gameData.leftPlayerScore = data.leftPlayerScore;
          gameData.rightPlayerScore = data.rightPlayerScore;
          gameData.ball = {
            x: data.ball.x,
            y: data.ball.y,
            vx: data.ball.vx,
            vy: data.ball.vy,
            radius: data.ball.radius,
            color: data.ball.color,
            speed: data.ball.speed,
          };
          gameData.startTheGame = data.startTheGame;
          gameData.firstInstructions = data.firstInstructions;
          if (gametype === "remote") {
            gameData.theCounter = data.theCounter;
          }
        } else {
          console.log("No ball data");
        }
        // Handle game state updates here
      };

      socket.onclose = function (e) {
        console.error("WebSocket closed unexpectedly");
      };

      let firstTime = true;
      let game;
      let canvas = document.createElement("canvas");
      let gameData = {
        width: 0,
        height: 0,
        xLeft: 0,
        yLeft: 0,
        xRight: 0,
        yRight: 0,
        heightPaddleSize: 0,
        widthPaddleSize: 0,
        leftPlayerScore: 0,
        rightPlayerScore: 0,
        img: new Image(),
        startTheGame: false,
        ball: {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 0,
          color: "",
          speed: 0,
        },
        i: 0,
        fontSize: 0,
        firstInstructions: true,
        theCounter: 0,
      };

      let leftkeys;
      let rightkeys;
      let leftscoreBar;
      let rightscoreBar;
      let leftPlayer;
      let rightPlayer;
      let firstInstructions = true;
      function letsStart(data) {
        let div = document.createElement("div");
        div.id = "myDiv";
        document.body.appendChild(div);
        // Create containers for players
        leftPlayer = document.createElement("div");
        rightPlayer = document.createElement("div");

        // Create player name and score elements
        let leftPlayerP = document.createElement("p");
        let rightPlayerP = document.createElement("p");
        let leftPlayerScore = document.createElement("p");
        let rightPlayerScore = document.createElement("p");

        // Set IDs for player name and score for CSS styling
        leftPlayerP.id = "leftPlayerP";
        rightPlayerP.id = "rightPlayerP";
        leftPlayerScore.id = "leftPlayerScore";
        rightPlayerScore.id = "rightPlayerScore";

        // Set IDs for the containers to style their position
        leftPlayer.id = "leftPlayer";
        rightPlayer.id = "rightPlayer";

        // Set player names and scores content
        leftPlayerP.innerText = "PLAYER 1";
        if(gametype === "local")
        {
          if(data.name)
          {
            leftPlayerP.innerText = data.name.toUpperCase();
          }
        }
        if (gameMode === "bot" && gametype === "local")
          rightPlayerP.innerText = "BOT";
        else if (gameMode === "player" && gametype === "local")
          rightPlayerP.innerText = playerName.toUpperCase();
        else if (gametype === "tournament") {
          rightPlayerP.innerText = playerName[1].toUpperCase();
          leftPlayerP.innerText = playerName[0].toUpperCase();
        }
        else if (gametype === "remote") {
          rightPlayerP.innerText = data.player2_Name;
          leftPlayerP.innerText = data.player1_Name;
        }
        else rightPlayerP.innerText = "PLAYER 2";
        leftPlayerScore.innerText = "0";
        rightPlayerScore.innerText = "0";

        //create the score bar
        rightscoreBar = document.createElement("div");
        rightscoreBar.className = "score-bar";
        leftscoreBar = document.createElement("div");
        leftscoreBar.className = "score-bar";
        //create the left bar
        let leftBar = document.createElement("div");
        leftBar.id = "leftBar";
        leftBar.className = "fill-bar";
        //create the right bar
        let rightBar = document.createElement("div");
        rightBar.id = "rightBar";
        rightBar.className = "fill-bar";

        // create W|S and ArrowUp|ArrowDown containers
        leftkeys = document.createElement("div");
        leftkeys.id = "leftkeys";
        rightkeys = document.createElement("div");
        rightkeys.id = "rightkeys";
        // create the img elements
        let leftLetters = document.createElement("img");
        if (gametype === "local" || gametype === "tournament")
          leftLetters.src = "./src/assets/resources/letters.svg";
        else if (gametype === "remote")
          leftLetters.src = "./src/assets/resources/arrows.svg";
        leftLetters.className = "movement-icon";
        let rightArrows = document.createElement("img");
        rightArrows.src = "./src/assets/resources/arrows.svg";
        rightArrows.className = "movement-icon";

        // Append name and score elements to the respective containers
        leftPlayer.appendChild(leftPlayerP);
        leftPlayer.appendChild(leftPlayerScore);
        rightPlayer.appendChild(rightPlayerP);
        rightPlayer.appendChild(rightPlayerScore);
        leftscoreBar.appendChild(leftBar);
        rightscoreBar.appendChild(rightBar);
        // leftPlayer.appendChild(leftscoreBar);
        // rightPlayer.appendChild(rightscoreBar);

        // Append the keys to the respective containers
        leftkeys.appendChild(leftLetters);
        rightkeys.appendChild(rightArrows);
        if (gameMode === "bot" && gametype === "local")
          rightkeys.style.display = "none";

        leftPlayer.appendChild(leftkeys);
        rightPlayer.appendChild(rightkeys);

        //add canvas-remote to the canvas
        if (gametype === "remote") canvas.classList.add("canvas-remotely");

        // Append both player containers to the main div
        div.appendChild(leftPlayer);
        div.appendChild(rightPlayer);
        div.appendChild(canvas);
        canvas.width = gameData.width;
        canvas.height = gameData.height;

        if (canvas.getContext) {
          game = canvas.getContext("2d");
        } else {
          alert("Canvas is not supported");
        }
        gameData.img.src = "./src/assets/resources/background0.png";
        gameData.img.onload = function () {
          // window.requestAnimationFrame(draw);
          draw(0);
        };
        // setTimeout(() => {
        //     console.log('start');
        //     if (socket.readyState === WebSocket.OPEN) {
        //         socket.send(JSON.stringify({
        //             event: 'start'
        //         }));
        //     }
        // }, 6000);
        // setTimeout(() => {
        //     firstInstructions = true;
        // }, 3000);
      }

      // the left paddle
      function drawRightRoundedRect(ctx, x, y, width, height, color) {
        let radius = width * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y); // Start at the top-left corner
        ctx.lineTo(x + width - radius, y); // Draw top edge
        ctx.arcTo(x + width, y, x + width, y + radius, radius); // Top-right corner (rounded)
        ctx.lineTo(x + width, y + height - radius); // Right edge
        ctx.arcTo(
          x + width,
          y + height,
          x + width - radius,
          y + height,
          radius
        ); // Bottom-right corner (rounded)
        ctx.lineTo(x, y + height); // Bottom edge
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      //the right paddle
      function drawLeftRoundedRect(ctx, x, y, width, height, color) {
        let radius = width * 0.5;
        ctx.beginPath();
        ctx.moveTo(x + width, y); // Start at the top-right corner
        ctx.lineTo(x + radius, y); // Draw top edge to the start of the left curve
        ctx.arcTo(x, y, x, y + radius, radius); // Top-left corner (rounded)
        ctx.lineTo(x, y + height - radius); // Left edge
        ctx.arcTo(x, y + height, x + radius, y + height, radius); // Bottom-left corner (rounded)
        ctx.lineTo(x + width, y + height); // Bottom edge
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }
      let fps = 60; // Target 60 frames per second
      let lastTime = 0;
      let glowIntensity = 20; // Glow intensity for the ball

      // Array to store previous positions of the ball
      let tailLength = 10; // Number of trail circles
      let ballTrail = [];
      let leftTest = 0;
      let rightTest = 0;
      function draw(currentTime) {
        let deltaTime = currentTime - lastTime;
        if (deltaTime >= 1000 / fps) {
          // Clear the canvas
          game.clearRect(0, 0, gameData.width, gameData.height);
          game.drawImage(gameData.img, 0, 0, gameData.width, gameData.height);

          // Draw the center line
          game.beginPath();
          game.moveTo(gameData.width / 2, gameData.width * 0.1);
          game.lineTo(
            gameData.width / 2,
            gameData.height - gameData.width * 0.1
          );
          game.lineWidth = 3;
          game.lineCap = "round";
          game.strokeStyle = "#BC00DD";
          game.shadowBlur = 10;
          game.shadowColor = "#BC00DD";
          game.stroke();
          game.shadowBlur = 0;
          game.closePath();

          // Store the ball's current position
          ballTrail.push({ x: gameData.ball.x, y: gameData.ball.y });
          // Limit the length of the trail
          if (ballTrail.length > tailLength) {
            ballTrail.shift();
          }

          // Draw the trail (starting with the most recent position for the larger tail)
          for (let i = ballTrail.length - 1; i >= 0; i--) {
            let trailOpacity = i / ballTrail.length; // Decreasing opacity for older positions
            let trailSize = gameData.ball.radius * trailOpacity; // Decrease size of the trail

            game.shadowBlur = glowIntensity * trailOpacity; // Apply a fading glow effect
            game.shadowColor = gameData.ball.color;

            game.beginPath();
            game.arc(
              ballTrail[i].x,
              ballTrail[i].y,
              trailSize,
              0,
              Math.PI * 2,
              true
            );
            game.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`; // White with decreasing opacity
            game.fill();
            game.closePath();
          }

          // Draw the current ball (most recent position) on top of the trail
          game.shadowBlur = glowIntensity;
          game.shadowColor = gameData.ball.color;
          game.beginPath();
          game.arc(
            gameData.ball.x,
            gameData.ball.y,
            gameData.ball.radius,
            0,
            Math.PI * 2,
            true
          );
          game.fillStyle = gameData.ball.color;
          game.fill();
          game.closePath();
          // Reset the shadow effect for other elements
          game.shadowBlur = 0;
          drawRightRoundedRect(
            game,
            gameData.xLeft,
            gameData.yLeft,
            gameData.widthPaddleSize,
            gameData.heightPaddleSize,
            "#00F0FF"
          );
          // Draw right paddle with rounded corners
          drawLeftRoundedRect(
            game,
            gameData.xRight,
            gameData.yRight,
            gameData.widthPaddleSize,
            gameData.heightPaddleSize,
            "#F20089"
          );
          //draw pause
          if (pause) {
            // game.shadowBlur = 10;
            // game.shadowColor = '#BC00DD';
            // game.fillStyle = "white";
            // game.font = `${gameData.fontSize}px audioWide`;
            // game.fillText("PAUSE", gameData.width * 0.45 , gameData.height * 0.45);
            // game.shadowBlur = 0;
            // game.shadowBlur = 10;
            // game.shadowColor = '#BC00DD';
            // game.fillStyle = "#6653DA";
            // game.fillRect(gameData.width * 0.25, gameData.height * 0.25, gameData.width * 0.15, gameData.height * 0.15);
            // game.shadowBlur = 0;

            game.fillStyle = "white";
            game.font = `${gameData.fontSize * 1.5}px audioWide`;
            game.fillText(
              "PAUSE",
              gameData.width * 0.45,
              gameData.height * 0.35
            );
            game.fillText(
              "Press ESC to continue",
              gameData.width * 0.35,
              gameData.height * 0.43
            );
            game.fillText("OR", gameData.width * 0.48, gameData.height * 0.51);

            let exitButtonX = gameData.width * 0.45;
            let exitButtonY = gameData.height * 0.55;
            let exitButtonWidth = gameData.width * 0.1;
            let exitButtonHeight = gameData.height * 0.1;
            game.shadowBlur = 50;
            game.shadowColor = "#BC00DD";
            game.fillStyle = "#6653DA";
            game.fillRect(
              exitButtonX,
              exitButtonY,
              exitButtonWidth,
              exitButtonHeight
            );
            game.shadowBlur = 0;

            game.fillStyle = "white";
            game.fillText(
              "EXIT",
              exitButtonX + exitButtonWidth * 0.15,
              exitButtonY + exitButtonHeight * 0.6
            );

            canvas.addEventListener("click", function (event) {
              let rect = canvas.getBoundingClientRect();
              let x = event.clientX - rect.left;
              let y = event.clientY - rect.top;

              if (
                x >= exitButtonX &&
                x <= exitButtonX + exitButtonWidth &&
                y >= exitButtonY &&
                y <= exitButtonY + exitButtonHeight
              ) {
                window.location.href = "/"; // Redirect to home or exit the game
              }
            });
          }
          // else{
          //     canvas.removeEventListener('click', function(event) {
          //         let rect = canvas.getBoundingClientRect();
          //         let x = event.clientX - rect.left;
          //         let y = event.clientY - rect.top;

          //         if (x >= exitButtonX && x <= exitButtonX + exitButtonWidth && y >= exitButtonY && y <= exitButtonY + exitButtonHeight) {
          //             window.location.href = '/'; // Redirect to home or exit the game
          //         }
          //     });
          // }
          // draw press space to start
          if (gametype === "local" || gametype === "tournament") {
            if (!gameData.startTheGame) {
              if (gameData.i > 10 && gameData.i < 30) {
                game.shadowBlur = 10;
                game.shadowColor = "#BC00DD";
                game.fillStyle = "white";
                game.font = `${gameData.fontSize}px audioWide`;
                game.fillText(
                  "PRESS SPACEBAR TO START!",
                  gameData.width * 0.35,
                  gameData.height * 0.45
                );
                game.shadowBlur = 0;
              }
              if (gameData.i > 30) {
                gameData.i = 0;
              }
              gameData.i++;
            }
            if (!gameData.firstInstructions && firstInstructions)
              animationMovementButton();
          } else if (gametype === "remote") {
            if (!gameData.startTheGame) {
              game.shadowBlur = 10;
              game.shadowColor = "#BC00DD";
              game.fillStyle = "white";
              game.font = `${gameData.fontSize}px audioWide`;
              game.fillText(
                "THE GAME START AT :",
                gameData.width * 0.29,
                gameData.height * 0.45
              );
              game.fillText(
                `${gameData.theCounter}`,
                gameData.width * 0.49,
                gameData.height * 0.52
              );
              game.shadowBlur = 0;
            }
            if (!gameData.firstInstructions && firstInstructions)
              animationMovementButton();
          }

          // Update the last time
          lastTime = currentTime;
          // if(firstInstructions === false)
          // {

          if (leftTest !== gameData.leftPlayerScore) {
            playerScored("left");
          }
          if (rightTest !== gameData.rightPlayerScore) {
            playerScored("right");
          }
          leftTest = gameData.leftPlayerScore;
          rightTest = gameData.rightPlayerScore;
          // }
          // leftPlayerScore.innerText = gameData.leftPlayerScore;
          // rightPlayerScore.innerText = gameData.rightPlayerScore;
        }

        // Continue the animation loop
        animationControle = window.requestAnimationFrame(draw);
      }

      let leftPlayerScore = 0;
      let rightPlayerScore = 0;

      function playerScored(player) {
        if (player === "left") {
          updateScore("left", gameData.leftPlayerScore);
        } else if (player === "right") {
          updateScore("right", gameData.rightPlayerScore);
        }
        console.log(
          "leftPlayerScore",
          leftPlayerScore,
          "rightPlayerScore",
          rightPlayerScore
        );
      }

      function updateScore(player, score) {
        const maxScore = 4; // Bar fills up when the player reaches 4 goals
        if (score > maxScore) {
          score = maxScore;
        }
        const barWidthPercentage = (score / maxScore) * 100;

        // Update the player's score on screen
        if (player === "left") {
          if (
            document.getElementById("leftPlayerScore") &&
            document.getElementById("leftBar")
          ) {
            document.getElementById("leftPlayerScore").textContent = score;
            document.getElementById("leftBar").style.width =
              barWidthPercentage + "%";
          }
        } else if (player === "right") {
          if (
            document.getElementById("rightPlayerScore") &&
            document.getElementById("rightBar")
          ) {
            document.getElementById("rightPlayerScore").textContent = score;
            document.getElementById("rightBar").style.width =
              barWidthPercentage + "%";
          }
        }
      }

      function sendNewSize() {
        if (gametype === "local" || gametype === "tournament") {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                event: "newSize",
                width: window.innerWidth,
                height: window.innerWidth,
              })
            );
          }
        }
      }

      let keys = {};
      if(gametype === "remote")
      {
        window.addEventListener("beforeunload", () => {
          if (socket.readyState === WebSocket.OPEN) {
              console.log('close socket before unload');
              socket.close();
          }
      });
      
      // Close the socket on back button navigation
      window.addEventListener("popstate", () => {
          if (socket.readyState === WebSocket.OPEN) {
              console.log('close socket on back button');
              socket.close();
          }
      });
      }
      window.addEventListener("resize", sendNewSize);
      window.addEventListener("keyup", handleKeyEvent);
      window.addEventListener("keydown", handleKeyEvent);
      function handleKeyEvent(event) {
        if (gametype === "local" || gametype === "tournament") {
          if (["ArrowUp", "ArrowDown", "w", "s"].includes(event.key)) {
            if (socket.readyState === WebSocket.OPEN) {
              keys[event.key] = event.type === "keydown";
              socket.send(
                JSON.stringify({
                  event: "movement",
                  key: keys,
                })
              );
            }
          }
          if (event.key === " ") {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  event: "start",
                })
              );
            }
          }
          if (event.key === "Escape" && event.type === "keyup") {
            if (gameData.startTheGame) {
              pause = !pause;
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                  JSON.stringify({
                    event: "pause",
                  })
                );
              }
            }
          }
        } else if (gametype === "remote") {
          if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            if (socket.readyState === WebSocket.OPEN) {
              keys[event.key] = event.type === "keydown";
              socket.send(
                JSON.stringify({
                  event: "movement",
                  id: id,
                  key: keys,
                })
              );
            }
          }
        }
      }
      window.addEventListener("blur", function () {
        if (gametype === "local" || gametype === "tournament") {
          if (socket.readyState === WebSocket.OPEN) {
            keys = { ArrowUp: false, ArrowDown: false, w: false, s: false };
            socket.send(
              JSON.stringify({
                event: "movement",
                key: keys,
              })
            );
          }
        } else if (gametype === "remote") {
          if (socket.readyState === WebSocket.OPEN) {
            keys = { ArrowUp: false, ArrowDown: false };
            socket.send(
              JSON.stringify({
                event: "movement",
                id: id,
                key: keys,
              })
            );
          }
        }
      });

      function randomID() {
        return Math.random().toString(36).substr(2, 9);
      }

      function animationMovementButton() {
        if (gametype === "local" || gametype === "tournament") {
          console.log("first instructions");
          if (
            leftkeys &&
            rightkeys &&
            leftscoreBar &&
            rightscoreBar &&
            leftPlayer &&
            rightPlayer
          ) {
            // Add fade-out class for the instructions
            leftkeys.classList.add("fade-out");
            rightkeys.classList.add("fade-out");

            // Wait for the fade-out to complete before removing the elements
            setTimeout(() => {
              leftkeys.remove();
              rightkeys.remove();

              // Add score bars with an animation
              leftscoreBar.classList.add("hidden", "slide-in"); // Hidden by default
              rightscoreBar.classList.add("hidden", "slide-in");

              leftPlayer.appendChild(leftscoreBar);
              rightPlayer.appendChild(rightscoreBar);

              // Trigger the fade-in and slide-in animation
              setTimeout(() => {
                leftscoreBar.classList.remove("hidden");
                rightscoreBar.classList.remove("hidden");
              }, 100); // Short delay to ensure the transition happens
            }, 500); // Duration should match the CSS transition duration (0.5s)
          }
          firstInstructions = false;
        } else if (gametype === "remote") {
          if (
            leftkeys &&
            rightkeys &&
            leftscoreBar &&
            rightscoreBar &&
            leftPlayer &&
            rightPlayer
          ) {
            // Add fade-out class for the instructions
            leftkeys.classList.add("fade-out");
            rightkeys.classList.add("fade-out");

            // Wait for the fade-out to complete before removing the elements

            leftkeys.remove();
            rightkeys.remove();

            // Add score bars with an animation
            leftscoreBar.classList.add("hidden", "slide-in"); // Hidden by default
            rightscoreBar.classList.add("hidden", "slide-in");

            leftPlayer.appendChild(leftscoreBar);
            rightPlayer.appendChild(rightscoreBar);

            // Trigger the fade-in and slide-in animation

            leftscoreBar.classList.remove("hidden");
            rightscoreBar.classList.remove("hidden");
            // Duration should match the CSS transition duration (0.5s)
          }
          firstInstructions = false;
        }
      }
    }
  }
  
  if (mode) {
    if (mode == 'Remote 1v1')
      game('remote');
    else if (mode == 'Tournament')
      game('tournament');
    else if (mode == '1vAI')
      game('bot');
    else if (mode == '1v1')
      game('local');
  } else {
    alert('No mode specified');
  }
}
