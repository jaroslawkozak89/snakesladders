 /*  Smooth scroll  */
$(document).ready(function(){
  $('body').scrollspy({target: ".navbar", offset: 50});
  $(".nav-item").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
  $(".navbar-brand").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
});

/*  Game code  */
let canvas = document.getElementById('canvas');
let canvasLeft = canvas.offsetLeft;
let canvasTop = canvas.offsetTop;
let context = canvas.getContext('2d');

let playerConfiguration = [0,0,0,0];
let playerColours = ['red', 'green', 'blue', 'yellow'];
let playerPosition = [0,0,0,0];
let playerOrder = [];
let playerCounter = 0;
let sameFieldArray = [];

let rollsCounter = 0;
let rollsTimeout = 100;
let lastRoll = 0;

let menuColourPositions = [[canvas.width * 2/7, canvas.height / 3 + 230], [canvas.width * 3/7, canvas.height / 3 + 230], [canvas.width * 4/7, canvas.height / 3 + 230], [canvas.width * 5/7, canvas.height / 3 + 230]];
let startGameButton = [canvas.width / 2, canvas.height * 2 / 3]

let startingFields = [[60, 1065], [135, 1065], [60, 1140], [135,1140]];
let playingFields = [[230, 1100], [335, 1100], [440, 1090], [545, 1100], [650, 1110], [755, 1120], [860, 1130], [965, 1120], [1070, 1100], [1130, 1020],
                     [1140, 930], [1130, 840], [1070, 770], [965, 750], [860, 760], [755, 820], [650, 860], [545, 855], [440, 855], [335, 865], 
                     [230, 875], [125, 855], [60, 785], [70, 695], [145, 625], [245, 640], [350, 680], [455, 670], [560, 660], [675, 640], 
                     [780, 610], [885, 600], [990, 610], [1095, 580], [1120, 490], [1095, 400], [990, 360], [885, 370], [780, 360], [675, 350], 
                     [570, 370], [465, 390], [360, 410], [255, 390], [150, 370], [65, 305], [55, 215], [75, 120], [160, 70], [265, 90], 
                     [370, 110], [475, 130], [580, 150], [685, 140], [785, 130], [885, 120], [985, 100]];
let endingFields = [[1065, 60], [1140, 60], [1065, 135], [1140, 135]];
let fieldSize = 30;

let snakeLocations = [[410, 855, 235], [1055, 580, 190], [330, 410, 280], [755, 130, 230]];
let ladderLocations = [[725, 820, 320], [215, 640, 235], [540, 370, 290], [235, 90, 300]];

let snakeLadderFrom = [19, 34, 43, 55, 6, 21, 29, 44];
let snakeLadderTo = [3, 13, 27, 39, 16, 26, 41, 50];

function drawSquare() {
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.beginPath()
  context.fillStyle = playerColours[i];
  context.rect(menuColourPositions[i][0]-60, menuColourPositions[i][1]-60, 120, 120);
  context.fill();
  context.stroke();
  context.closePath();
};

function drawRobot(x,y) {
  let robotIcon = new Image();
  robotIcon.src = 'img/robot.svg';
  robotIcon.onload = function() {
    context.drawImage(robotIcon, x, y, 90, 90);
  };
};

function drawSnake(x,y, height) {
  let snake = new Image();
  snake.src = 'img/snake.png';
  snake.onload = function() {
    context.drawImage(snake, x, y, 60, height);
  };
};

function drawLadder(x,y, height) {
  let ladder = new Image();
  ladder.src = 'img/ladder.png';
  ladder.onload = function() {
    context.drawImage(ladder, x, y, 60, height);
  };
};

function drawPerson(x,y) {
  let personIcon = new Image();
  personIcon.src = 'img/person.svg';
  personIcon.onload = function() {
    context.drawImage(personIcon, x, y, 90, 90);
  };
};

function drawGrassBackground() {
  let grassBackground = new Image();
  grassBackground.src = 'img/grasssmall.jpg';
  grassBackground.onload = function() {
    let x = 0;
    for (let i = 0; i < 12; i++) {
      let y = 0;
      for (let j = 0; j < 12; j++) {
        context.drawImage(grassBackground, x, y, 100, 100);
        y = y + 100;
      };
      x = x + 100;
    };
  };
};

function drawPawn(player, x, y) {
  let pawn = new Image();
  pawn.src = 'img/'.concat(playerColours[player], 'pawn.png');
  pawn.onload = function () {
    context.drawImage(pawn, x, y, 60, 60);
  };
};

function drawSnakesAndLadders() {
  for (i in snakeLocations) {
    drawSnake(snakeLocations[i][0], snakeLocations[i][1], snakeLocations[i][2]);
  };
  for (i in ladderLocations) {
    drawLadder(ladderLocations[i][0], ladderLocations[i][1], ladderLocations[i][2]);
  };
}

function drawLabel(player) {
  setTimeout(function() {
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.fillStyle = 'gold';
    context.beginPath();
    context.rect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);
    context.fill();
    context.stroke();
    context.closePath();
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    if (playerConfiguration[player] == 1) {
      context.fillText('Player '.concat(playerColours[player]), canvas.width / 2, canvas.height / 2 - 60);
      context.fillText('Your turn', canvas.width / 2, canvas.height / 2 - 30);
      context.fillStyle = 'silver';
      context.beginPath();
      context.rect(canvas.width / 2 - 70, canvas.height / 2, 140, 60);
      context.fill();
      context.stroke();
      context.closePath();
      context.fillStyle = '#000000';
      context.fillText('Roll', canvas.width / 2, canvas.height / 2 + 38);   
      canvas.addEventListener('click', beforeRollNumber);
    } else {
      context.fillText('Robot '.concat(playerColours[player]), canvas.width / 2, canvas.height / 2 - 12);
      context.fillText('Your turn', canvas.width / 2, canvas.height / 2 + 18);
      setTimeout(rollNumber, 2000);
    };
  }, 100);
};

function drawWinLabel() {
  setTimeout(function() {
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.fillStyle = 'gold';
    context.beginPath();
    context.rect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);
    context.fill();
    context.stroke();
    context.closePath();
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('Player '.concat(playerColours[playerPosition.indexOf(58)]), canvas.width / 2, canvas.height / 2 - 60);
    context.fillText('You won!', canvas.width / 2, canvas.height / 2 - 30);
    context.fillStyle = 'silver';
    context.beginPath();
    context.rect(canvas.width / 2 - 70, canvas.height / 2, 140, 60);
    context.fill();
    context.stroke();
    context.closePath();
    context.fillStyle = '#000000';
    context.fillText('Play again', canvas.width / 2, canvas.height / 2 + 38);
  }, 100);
};

function rollNumber() {
  let rolledNum = Math.floor(Math.random() * 6 + 1);
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  context.fillStyle = 'gold';
  context.beginPath();
  context.rect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);
  context.fill();
  context.stroke();
  context.closePath();
  context.fillStyle = '#000000';
  context.font = '108px Arial';
  context.textAlign = 'center';
  context.fillText(''.concat(rolledNum), canvas.width / 2, canvas.height / 2 + 41);
  if (rollsCounter < 5) {
    rollsCounter++;
    rollsTimeout += 50;
    setTimeout(rollNumber, rollsTimeout);
  } else {
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('You rolled', canvas.width / 2, canvas.height / 2 - 50);
    if (playerPosition[playerOrder[playerCounter]] + rolledNum < 59) {
      playerPosition[playerOrder[playerCounter]] += rolledNum;
    };
    playerCounter++;
    setTimeout(nextTurn, 3000);
  };
};

function nextTurn() {
  if (playerPosition.includes(58) != true) {
    sameField();
    drawGrassBackground();
    setTimeout(drawFields, 20);
    setTimeout(drawSnakesAndLadders, 20);
    setTimeout(function() {
      for (player in playerOrder) {
        if (playerPosition[playerOrder[player]] == 0) {
          drawPawn(playerOrder[player], startingFields[playerOrder[player]][0]-30, startingFields[playerOrder[player]][1]-40);
        } else {
          if (snakeLadderFrom.includes(playerPosition[playerOrder[player]]) == true) {
            drawPawn(playerOrder[player], playingFields[playerPosition[playerOrder[player]]-1][0]-30, playingFields[playerPosition[playerOrder[player]]-1][1]-50+10*sameFieldArray[[playerOrder[player]]]);
            playerPosition.forEach(function(value, index) {
              if (value == playerPosition[playerOrder[player]]) {
                sameFieldArray[index]--;
              };
            });
            playerPosition[playerOrder[player]] = snakeLadderTo[snakeLadderFrom.indexOf(playerPosition[playerOrder[player]])];
            setTimeout(nextTurn, 1000);
          } else {
            drawPawn(playerOrder[player], playingFields[playerPosition[playerOrder[player]]-1][0]-30, playingFields[playerPosition[playerOrder[player]]-1][1]-50+10*sameFieldArray[[playerOrder[player]]]);
            playerPosition.forEach(function(value, index) {
              if (value == playerPosition[playerOrder[player]]) {
                sameFieldArray[index]--;
              };
            });
          };
        };
      };
    }, 20);
    if (playerCounter == playerOrder.length) {
      playerCounter = 0;
    }
    rollsCounter = 0;
    rollsTimeout = 100;
    setTimeout(function() {
      drawLabel(playerOrder[playerCounter]);
    }, 2000);
  } else {
    drawGrassBackground();
    setTimeout(drawFields, 20);
    setTimeout(drawSnakesAndLadders, 20);
    setTimeout(function() {
      for (player in playerOrder) {
        if (playerPosition[playerOrder[player]] == 0) {
          drawPawn(playerOrder[player], startingFields[playerOrder[player]][0]-30, startingFields[playerOrder[player]][1]-40);
        } else if (playerPosition[playerOrder[player]] < 58) {
          drawPawn(playerOrder[player], playingFields[playerPosition[playerOrder[player]]-1][0]-30, playingFields[playerPosition[playerOrder[player]]-1][1]-50+10*sameFieldArray[[playerOrder[player]]]);
          playerPosition.forEach(function(value, index) {
            if (value == playerPosition[playerOrder[player]]) {
              sameFieldArray[index]--;
            };
          });
        } else {
          drawPawn(playerOrder[player], endingFields[playerOrder[player]][0]-30, endingFields[playerOrder[player]][1]-40);
        };
      };
    }, 20);
    setTimeout(function() {
      drawWinLabel();
    }, 2000);
    canvas.addEventListener('click', startNewGame);
  };
};

function sameField() {
  sameFieldArray = [];
  for (i in playerPosition) {
    sameFieldArray.push(playerPosition.filter((n) => (n === playerPosition[i])).length);
  };
};

function drawFields() {
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  for (i in playingFields) {
    num = i + 1;
    if (i % 2 == 0) {
      context.fillStyle = '#DFCC9C';
    } else {
      context.fillStyle = '#AA9E7C';
    };
    context.beginPath();
    context.arc(playingFields[i][0], playingFields[i][1], fieldSize, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
  };
  for (i in playerColours) {
    context.fillStyle = playerColours[i];
    context.beginPath();
    context.arc(startingFields[i][0], startingFields[i][1], fieldSize, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(endingFields[i][0], endingFields[i][1], fieldSize, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
  };
};

function clean() {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 1200, 1200);
};

function changeConfiguration(event) {
  let x = event.pageX - canvasLeft;
  let y = event.pageY - canvasTop;
  for (i in menuColourPositions) {
    if (y > (menuColourPositions[i][1]-60)*2/3 && y < (menuColourPositions[i][1]+60)*2/3 && x > (menuColourPositions[i][0]-60)*2/3 && x < (menuColourPositions[i][0]+60)*2/3) {
      playerConfiguration[i]++;
      if (playerConfiguration[i] == 0) {
        drawSquare();
      } else if (playerConfiguration[i] == 1) {
        drawSquare();
        drawPerson(menuColourPositions[i][0]-45, menuColourPositions[i][1]-45);
      } else if (playerConfiguration[i] == 2) {
        drawSquare();
        drawRobot(menuColourPositions[i][0]-45, menuColourPositions[i][1]-45);
      } else {
        playerConfiguration[i] = 0;
        drawSquare();
      };
    };
  };
};

function beforeStartGame(event) {
  let x = event.pageX - canvasLeft;
  let y = event.pageY - canvasTop;
  if (y > (startGameButton[1]-50)*2/3 && y < (startGameButton[1]+50)*2/3 && x > (startGameButton[0]-200)*2/3 && x < (startGameButton[0]+200)*2/3) {
    
    let playersChosen = 0;
    for (i in playerConfiguration) {
      playersChosen = playersChosen + playerConfiguration[i];
    };

    if (playersChosen == 0) {
      context.fillStyle = 'red';
      context.font = '36px Arial';
      context.textAlign = 'center';
      context.fillText('There has to be at least 1 player', startGameButton[0], startGameButton[1]+100);
    } else {
      startGame();
    };
  };
};

function beforeRollNumber(event) {
  canvas.removeEventListener('click', beforeRollNumber);
  let x = event.pageX - canvasLeft;
  let y = event.pageY - canvasTop;
  if (y > (canvas.height / 2)*2/3 && y < (canvas.height / 2 + 60)*2/3 && x > (canvas.width / 2 - 70)*2/3 && x < (canvas.width / 2 + 70)*2/3) {
    rollNumber();
  };
};

function startNewGame(event) {
  canvas.removeEventListener('click', startNewGame);
  let x = event.pageX - canvasLeft;
  let y = event.pageY - canvasTop;
  if (y > (canvas.height / 2)*2/3 && y < (canvas.height / 2 + 60)*2/3 && x > (canvas.width / 2 - 70)*2/3 && x < (canvas.width / 2 + 70)*2/3) {
    menu();
  };
};

function setPlayerOrder() {
  for (i in playerConfiguration) {
    if (playerConfiguration[i] != 0) {
      playerOrder.push(i);
    };
  };
  shufflePlayers(playerOrder);
};

function shufflePlayers(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };
};

function menu() {
  drawGrassBackground();
  setTimeout(function() {
    rollsCounter = 0;
    rollsTimeout = 100;
    playerConfiguration = [0,0,0,0];
    playerColours = ['red', 'green', 'blue', 'yellow'];
    playerPosition = [0,0,0,0];

    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.beginPath()
    context.fillStyle = 'white';
    context.rect(canvas.width / 6, canvas.height / 5, canvas.width * 4/6, canvas.height * 3/5);
    context.fill();
    context.stroke();
    context.closePath();

    context.fillStyle = '#000000';
    context.font = '36px Arial';
    context.textAlign = 'center';
    context.fillText('Choose your configuration', canvas.width / 2, canvas.height / 3);
    context.font = '18px Arial';
    context.fillText('Each square represents a player. Person icon represents real player,', canvas.width / 2, canvas.height / 3 + 50);
    context.fillText('robot icon represents computer player, if you leave a square empty, that colour won\'t play.', canvas.width / 2, canvas.height / 3 + 70);
    context.font = '24px Arial';
    context.fillText('Click on a square to make a choice', canvas.width / 2, canvas.height / 3 + 110);

    for (i in playerColours) {  
      drawSquare();
    };

    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.beginPath()
    context.fillStyle = 'gold';
    context.rect(startGameButton[0]-200, startGameButton[1]-50, 400, 100);
    context.fill();
    context.stroke();
    context.closePath();
    context.fillStyle = '#000000';
    context.font = '48px Arial';
    context.textAlign = 'center';
    context.fillText('Start Game', startGameButton[0], startGameButton[1]+15);

    canvas.addEventListener('click', changeConfiguration);
    canvas.addEventListener('click', beforeStartGame);
  }, 100);
};

function startGame() {
  playerOrder = [];
  setPlayerOrder();
  canvas.removeEventListener('click', changeConfiguration);
  canvas.removeEventListener('click', beforeStartGame);
  drawGrassBackground();
  setTimeout(drawFields, 20);
  setTimeout(drawSnakesAndLadders, 40);
  setTimeout(function() {
    for (player in playerOrder) {
      drawPawn(playerOrder[player], startingFields[playerOrder[player]][0]-30, startingFields[playerOrder[player]][1]-40);
    };
  }, 20);
  drawLabel(playerOrder[playerCounter]);

};

menu()




