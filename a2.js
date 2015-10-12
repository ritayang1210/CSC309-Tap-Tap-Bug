var canvasGame = document.getElementById("gameView");
var ctxGame = canvasGame.getContext("2d");

var canvasInfor = document.getElementById("inforBar");
var ctxInfor = canvasInfor.getContext("2d");
ctxInfor.font = "60px Courier New";

var timer;
var timerFunc;
setInterval(drawScore, 100);
var resume;
var foodCounter;
var gameView;
var bugAppear;
var foodList;
var bugList;
var curScore;
var beginningTimer;
var beginning;

gameStart();

function gameStart() {
    foodList = [];
    bugList = [];
    timer = 60;
    bugAppear = 0
    curScore = 0
    resume = false;
    beginningTimer = 4;
    beginning = setInterval(drawBeginning, 1000);
    generateFoods();
    timerFunc = setInterval(drawTimer, 1000);
    gameView = setInterval(function() { drawGameView() }, 1);
}

function drawBeginning() {
    if (beginningTimer >= 0) {
        ctxGame.clearRect(0, 0, 400, 600);
        ctxGame.save();
        ctxGame.font = "60px Courier New";
        ctxGame.fillStyle = "black";
        if (beginningTimer == 4) {
            var level = localStorage.getItem("levelSelect") == "level1" ? 1 : 2;
            ctxGame.fillText("level " + level, 110, 225, 180);
        } else if (beginningTimer > 0) {
            ctxGame.fillText(beginningTimer, 180, 225, 180);
        } else {
            ctxGame.fillText("GO!", 160, 225, 180);
        }
        ctxGame.restore();
        beginningTimer--;
    } else {
        changeState();
        clearInterval(beginning);
    }
}

function startGame() {
    var level1 = document.getElementById("level1");
    var level2 = document.getElementById("level2");
    if (typeof(Storage) !== "undefined") {
        window.location = 'game.html';
    } else {
        alert("Sorry! No Web Storage support");
    }
}

function drawScore() {
    ctxInfor.clearRect(240, 0, 100, 200);
    ctxInfor.fillText("Score: " + curScore, 240, 100, 50);
}

function drawTimer() {
    if (timer >= 0 && resume) {
        ctxInfor.clearRect(0, 0, 100, 200);
        ctxInfor.fillText(timer + " sec", 10, 100, 50);
        timer--;
    } else if (timer < 0) {
        if (curScore > localStorage.getItem("highestScore" + localStorage.getItem("levelSelect"))) {
            localStorage.setItem("highestScore" + localStorage.getItem("levelSelect"), curScore);
        }
        gameOver(true);
    }
}

function changeState() {
    if (!resume) {
        drawPause();
        resume = true;
    } else if (resume) {
        drawResume();
        resume = false;
    }
}

function drawPause() {
    ctxInfor.clearRect(100, 0, 100, 200);
    var rectangle = new Path2D();
    rectangle.rect(140, 50, 5, 60);
    rectangle.rect(150, 50, 5, 60);
    ctxInfor.fill(rectangle);
}

function drawResume() {
    ctxInfor.clearRect(100, 0, 100, 200);

    var path = new Path2D();
    path.moveTo(160,80);
    path.lineTo(145,110);
    path.lineTo(145,50);
    ctxInfor.fill(path);
}

function drawGameView() {
    if (!resume) {
        return;
    }

    ctxGame.clearRect(0, 0, 400, 600);

    if (foodCounter == 0) {
        gameOver(false);

        return;
    }

    bugAppear -= 10;
    if (bugAppear <= 0) {
        bugList.push(new Bug());
        bugAppear = Math.floor(Math.random() * 3000)+1000;
    }

    for (i = 0; i < foodList.length; i++) {
        if (!foodList[i].eaten) {
            foodList[i].draw();
        }
    }

    for (j = 0; j < bugList.length; j++) {
        var bug = bugList[j];
        bug.move();
    }

    for (i = 0; i < bugList.length; i++) {
        var bug1 = bugList[i];
        for (j = i + 1; j < bugList.length; j++) {
            var bug2 = bugList[j];
            if (bug1.alive && bug2.alive && calcDist(bug1.xCoord, bug1.yCoord, bug2.xCoord, bug2.yCoord) <= 40) {
                if (bug1.speed == bug2.speed) {
                    if (bug1.xCoord < bug2.xCoord) {
                        bug1.moveBack();
                    } else {
                        bug2.moveBack();
                    }
                } 
            }
        }
    }

    for (j = 0; j < bugList.length; j++) {
        var bug = bugList[j];
        bug.draw();
    }
}

function gameOver(win) {
    clearInterval(gameView);
    clearInterval(timerFunc);
    

    ctxGame.clearRect(0, 0, 400, 600);

    if (win) {
        if (localStorage.getItem("levelSelect") == "level1") {
            localStorage.setItem("levelSelect", "level2");

            gameStart();
            return;
        }
    }
    var level;
    if (win && localStorage.getItem("levelSelect") == "level2") {
        level = "level1";
    } else {
        level = localStorage.getItem("levelSelect");
    }

    // if (win) {
    //     levelComplete();
    // }

    // if (!win) {
    //     levelFailed();
    // }
    var imgWin = new Image();
    imgWin.onload = function() {
        if (win) {
            ctxGame.drawImage(imgWin, 55, 0);
        } 
    }
    imgWin.src = 'smilingFace.jpg';

    var imgLose = new Image();
    imgLose.onload = function() {
        if (!win) {
            ctxGame.drawImage(imgLose, 130, 0);
        } 
    }
    imgLose.src = 'cryingFace.jpg';


    showScore();
    curScore = 0;
    drawRestart(level);
    drawExit();
}

// function levelFailed() {
//     ctxGame.save();
//     ctxGame.font = "80px Verdana";
//     // Create gradient
//     var gradient = ctxGame.createLinearGradient(0, 0, canvasGame.width, 0);
//     gradient.addColorStop("0", "brown");
//     gradient.addColorStop("0.5", "blue");
//     gradient.addColorStop("1.0", "green");
//     // Fill with gradient
//     ctxGame.fillStyle = gradient;
//     ctxGame.fillText("Level Failed!", 25, 150, 345);
//     ctxGame.restore();
// }

// function levelComplete() {
//     ctxGame.save();
//     ctxGame.font = "80px Verdana";
//     // Create gradient
//     var gradient = ctxGame.createLinearGradient(0, 0, canvasGame.width, 0);
//     gradient.addColorStop("0", "magenta");
//     gradient.addColorStop("0.5", "blue");
//     gradient.addColorStop("1.0", "red");
//     // Fill with gradient
//     ctxGame.fillStyle = gradient;
//     ctxGame.fillText("Level Complete!", 25, 150, 345);
//     ctxGame.restore();
// }


function showScore() {
    ctxGame.save();
    ctxGame.font = "60px Courier New";
    ctxGame.fillStyle = "black";
    ctxGame.fillText("Your Score: " + curScore, 50, 300, 300);
    ctxGame.restore();
}

function drawRestart(level) {
    ctxGame.save();
    ctxGame.font = "60px Courier New";
    ctxGame.fillStyle = "black";
    ctxGame.fillText("Restart", 110, 425, 180);
    var rectangle = new Path2D();
    rectangle.rect(100, 380, 200, 60);
    ctxGame.stroke(rectangle);
    ctxGame.restore();

    window.addEventListener("click", restart, false);
    function restart(event) {
        x = event.pageX - canvasGame.offsetLeft;
        y = event.pageY - canvasGame.offsetTop;
        if (x >= 100 && x <= 300 && y >= 380 && y <= 440) {
            ctxGame.clearRect(0, 0, 400, 600);
            localStorage.setItem("levelSelect", level);
            window.removeEventListener('click', restart, false);
            gameStart();
        }
    }
}

function drawExit() {
    ctxGame.save();
    ctxGame.font = "60px Courier New";
    ctxGame.fillStyle = "black";
    ctxGame.fillText("Exit", 127, 525, 180);
    var rectangle = new Path2D();
    rectangle.rect(100, 480, 200, 60);
    ctxGame.stroke(rectangle);
    ctxGame.restore();

    window.addEventListener("click", exit, false);
    function exit(event) {
        x = event.pageX - canvasGame.offsetLeft;
        y = event.pageY - canvasGame.offsetTop;
        if (x >= 100 && x <= 300 && y >= 480 && y <= 540) {
            ctxGame.clearRect(0, 0, 400, 600);
            window.location = "a2.html";
        }
    }
}

function generateFoods() {
    for (i = 0; i < 5; i++) {
        var newFood = new food();
        while (newFood.overlapWith()) {
            newFood = new food();
        }
        foodList.push(newFood);
    }
    foodCounter = 5;
}

function food() {
    this.xCoord = Math.floor(Math.random() * (381) + 10);
    this.yCoord = Math.floor(Math.random() * (461) + 130);
    this.eaten = false;

    this.draw = function() {
        var path = new Path2D();
        path.arc(this.xCoord, this.yCoord, 10, 0, 2 * Math.PI, false);
        ctxGame.fillStyle = "blue";
        ctxGame.fill(path);
    }

    this.overlapWith = function() {
        for (i = 0; i < foodList.length; i++) {
            if (Math.sqrt(Math.pow(this.xCoord - foodList[i].xCoord, 2) + Math.pow(this.yCoord - foodList[i].yCoord, 2)) <= 20) {
                return true;
            }
        }
        return false;
    }
}

function Bug() {
    this.alive = true;
    this.xCoord = Math.floor(Math.random() * (381) + 10);
    this.yCoord = 0;
    this.opacity = 1;
    this.lastMoveType;
    this.lastRot;
    this.lastMoveX;
    this.lastMoveY;
    this.width = 16;
    this.height = 44;

    this.findNearestFood = function() {
        var minDist = Number.MAX_VALUE;
        var result;
        for (i = 0; i < foodList.length; i++) {
            var food = foodList[i];
            var dist = calcDist(this.xCoord, this.yCoord, food.xCoord, food.yCoord);
            if (!food.eaten && dist < minDist) {
                result = food;
                minDist = dist;
            }
        }
        return result;
    }

    this.chooseColor = function() {
        var colorArray = ["black", "red", "orange"];
        var num = Math.random();
        if (num < 0.3) {
            return colorArray[0];
        } else if (0.3 <= num && num < 0.6) {
            return colorArray[1];
        } else {
            return colorArray[2];
        }
    }

    this.getDirection = function() {
        var result = Math.atan2(this.targetFood.yCoord - this.yCoord, this.targetFood.xCoord - this.xCoord) + Math.PI / 2;
        if (result > 2 * Math.PI) {
            result -= 2 * Math.PI
        } else if (result < 0) {
            result += 2 * Math.PI;
        }
        return result;
    }

    this.getSpeed = function() {
        if (this.color == "black") {
            if (localStorage.getItem("levelSelect") == "level2") {
                return 0.2;
            } else {
                return 0.15;
            }
        } else if (this.color == "red") {
            if (localStorage.getItem("levelSelect") == "level2") {
                return 0.1;
            } else {
                return 0.075;
            }
        } else if (this.color == "orange") {
            if (localStorage.getItem("levelSelect") == "level2") {
                return 0.08;
            } else {
                return 0.06;
            }
        }
    }

    this.getScore = function() {
        if (this.color == "black") {
            return 5;
        } else if (this.color == "red") {
            return 3;
        } else if (this.color == "orange") {
            return 1;
        }
    }

    this.color = this.chooseColor();
    this.speed = this.getSpeed();
    this.score = this.getScore();
    this.targetFood = this.findNearestFood();
    this.direction = this.getDirection();

    this.draw = function() {
        ctxGame.save();
        var path = new Path2D();

        ctxGame.fillStyle = this.color;
        ctxGame.strokeStyle = this.color;
        ctxGame.globalAlpha = this.opacity;

        ctxGame.translate(this.xCoord, this.yCoord);
        ctxGame.rotate(this.direction);

        path.arc(0, -17, 4, 0, 2 * Math.PI, false);
        path.ellipse(0, 0, 13, 3, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctxGame.fill(path);

        ctxGame.beginPath();

        ctxGame.moveTo(0, -17);
        ctxGame.lineTo(-5, -27);

        ctxGame.moveTo(0, -17);
        ctxGame.lineTo(5, -27);

        ctxGame.moveTo(0, -3);
        ctxGame.lineTo(5, -10);
        ctxGame.lineTo(6, -15);

        ctxGame.moveTo(0, -3);
        ctxGame.lineTo(-5, -10);
        ctxGame.lineTo(-6, -15);

        ctxGame.moveTo(0, -4);
        ctxGame.lineTo(5, -4);
        ctxGame.lineTo(5, -1);

        ctxGame.moveTo(0, -4);
        ctxGame.lineTo(-5, -4);
        ctxGame.lineTo(-5, -1);

        ctxGame.moveTo(0, -3);
        ctxGame.lineTo(5, 3)
        ctxGame.lineTo(6, 8);

        ctxGame.moveTo(0, -3);
        ctxGame.lineTo(-5, 3);
        ctxGame.lineTo(-6, 8);

        ctxGame.stroke();
        ctxGame.restore();
    }

    this.move = function() {
        if (this.alive) {
            this.targetFood = this.findNearestFood();
            if (this.targetFood == null) {
                return;
            }
            if (calcDist(this.xCoord, this.yCoord, this.targetFood.xCoord, this.targetFood.yCoord) < 10) {
                this.targetFood.eaten = true;
                foodCounter--;
            }
            var rightDirection = this.getDirection();
            if (Math.abs(this.direction - rightDirection) > 0.1) {
                this.lastMoveType = "rotation";
                this.lastRot = ((rightDirection - this.direction) / 10);
                this.direction += this.lastRot;
            } else {
                this.lastMoveType = "forward";
                this.lastMoveX = (Math.sin(this.direction) * this.speed)
                this.lastMoveY = -(Math.cos(this.direction) * this.speed)
                this.xCoord += this.lastMoveX;
                this.yCoord += this.lastMoveY;
            }
        } else {
            if (this.opacity > 0.005) {
                this.opacity -= 0.005;
            }
        }
    }

    this.moveBack = function() {
        if (this.lastMoveType == "rotation") {
            this.direction -= this.lastRot;
            this.lastRot = 0;
        } else if (this.lastMoveType == "forward") {
            this.xCoord -= this.lastMoveX;
            this.yCoord -= this.lastMoveY;
            this.lastMoveX = 0;
            this.lastMoveY = 0;
        }
    }
}

function calcDist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

window.addEventListener("click", doMouseDown, false);
function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x >= 190 && x <= 220 && y >= 27 && y <=60) {
     changeState();
  }
}

canvasGame.addEventListener('click', function(evt) {
    x = evt.pageX - canvasGame.offsetLeft;
    y = evt.pageY - canvasGame.offsetTop;
    for (i = 0; i < bugList.length; i++) {
        var bug = bugList[i];
        if (bug.alive) {
            var dist = Math.sqrt( Math.pow((x - bug.xCoord), 2) + Math.pow((y- bug.yCoord), 2) ) ;
            if (dist <= 30){
                bug.alive = false;
                curScore += bug.score;
            } 
        }
    }
}, false); 

function loadMaxAndSelectLevel() {
    var level1 = document.getElementById("level1");
    var level2 = document.getElementById("level2");
    if (level1.checked) {
        localStorage.setItem("levelSelect", level1.value);
    } else if (level2.checked) {
        localStorage.setItem("levelSelect", level2.value);
    }
    
    var score = document.getElementById("scoreCounter");
    score.innerHTML = localStorage.getItem("highestScore" + localStorage.getItem("levelSelect")) == null ?
        0 : localStorage.getItem("highestScore" + localStorage.getItem("levelSelect"));
}
