var canvasGame = document.getElementById("gameView");
var ctxGame = canvasGame.getContext("2d");

var canvasInfor = document.getElementById("inforBar");
var ctxInfor = canvasInfor.getContext("2d");
ctxInfor.font = "60px Courier New"

var timer = 60;
var timerfuc = setInterval(drawTimer, 1000);
setInterval(drawScore, 100);

var resume = false;
changeState();

var foodCounter;
var foodList = [];

generateFoods();
var bugAppear = 0;
var bugList = [];

var gameView = setInterval(function() { drawGameView() }, 1);

var curScore = 0;
localStorage.setItem("highestScore", 0);

function startGame() {
    var level1 = document.getElementById("level1");
    var level2 = document.getElementById("level2");
    if (typeof(Storage) !== "undefined") {
        if (level1.checked) {
            localStorage.setItem("levelSelect", level1.value);
        } else if (level2.checked) {
            localStorage.setItem("levelSelect", level2.value);
        } else {
            alert("Please select game level!");
            return;
        }
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
        timer = timer - 1;
        ctxInfor.clearRect(0, 0, 100, 200);
        ctxInfor.fillText(timer + " sec", 10, 100, 50);
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
        clearInterval(gameView);
        clearInterval(timerfuc);
        if (curScore > localStorage.getItem("highestScore")) {
            localStorage.setItem("highestScore", curScore);
        }
        alert("Game Over\nScore: " + curScore);
        return;
    }

    bugAppear -= 10;
    if (bugAppear <= 0) {
        bugList.push(new Bug());
        bugAppear = Math.random() * 3000;
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

    this.findNearestFood = function() {
        var minDist = Number.MAX_VALUE;
        var result;
        for (i = 0; i < foodList.length; i++) {
            var food = foodList[i];
            var dist = Math.sqrt(Math.pow(this.xCoord - food.xCoord, 2) + Math.pow(this.yCoord - food.yCoord, 2));
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
                return 2.0;
            } else {
                return 1.5;
            }
        } else if (this.color == "red") {
            if (localStorage.getItem("levelSelect") == "level2") {
                return 1.0;
            } else {
                return 0.75;
            }
        } else if (this.color == "orange") {
            if (localStorage.getItem("levelSelect") == "level2") {
                return 0.8;
            } else {
                return 0.6;
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
            if (Math.abs(this.targetFood.yCoord - this.yCoord) < 10 && Math.abs(this.targetFood.xCoord - this.xCoord) < 10) {
                this.targetFood.eaten = true;
                foodCounter--;
            }
            var rightDirection = this.getDirection();
            if (Math.abs(this.direction - rightDirection) > 0.1) {
                this.direction += ((rightDirection - this.direction) / 10);
            } else {
                this.xCoord += (Math.sin(this.direction) * this.speed);
                this.yCoord -= (Math.cos(this.direction) * this.speed);
            }
        } else {
            if (this.opacity > 0.005) {
                this.opacity -= 0.005;
            }
        }
        this.draw();
    }
}

window.addEventListener("mousedown", doMouseDown, false);
function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x >= 190 && x <= 220 && y >= 27 && y <=60) {
     changeState();
  }
}

canvasGame.addEventListener('mousedown', function(evt) {
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

