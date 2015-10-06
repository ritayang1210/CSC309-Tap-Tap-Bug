var canvasGame = document.getElementById("gameView");
var ctxGame = canvasGame.getContext("2d");

var canvasInfor = document.getElementById("inforBar");
var ctxInfor = canvasInfor.getContext("2d");
ctxInfor.font = "60px Courier New"

var timer = 60;
var timerfuc = setInterval(drawTimer, 1000);

var pause = false;
changeState();

var color = 'black';
var xCoord = canvasGame.width / 2;
var yCoord = canvasGame.height / 2;
var bugRot = 0;
//var bugfuc = setInterval(moveBugs, 1000);

var foodList = [];
drawFoods();
var newBug = new Bug();
newBug.draw();
setInterval(function() { newBug.move() }, 100);
window.addEventListener("mousedown", doMouseDown, false);

function scoreCounter() {
    var highestScore = 2;
    var score = 3;
    if (score >= highestScore) {
        localStorage.setItem("highestScore", score);
    }
    document.getElementById("scoreCounter").textContent = localStorage.getItem("highestScore");
}

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
        window.location='game.html';
    } else {
        alert("Sorry! No Web Storage support");
    }
}

function drawTimer() {
    if (timer == 0) {
        alert("Game Over");
        clearInterval(timerfuc);
        return;
    } else if (pause==true) {
        timer = timer - 1;
        ctxInfor.clearRect(0, 0, 100, 200);
        ctxInfor.fillText(timer + " sec", 10, 100, 50);
    }
}

function changeState() {
    if (pause == false) {
        drawPause();
        pause = true;
    } else if (pause == true) {
        drawResume();
        pause = false;
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

    var path=new Path2D();
    path.moveTo(160,80);
    path.lineTo(145,110);
    path.lineTo(145,50);
    ctxInfor.fill(path);
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

    this.overlapWith = function(existingFoods) {
        for (i = 0; i < existingFoods.length; i++) {
            var existingFood = existingFoods[i]
            if (Math.sqrt(Math.pow(this.xCoord - existingFood.xCoord, 2) + Math.pow(this.yCoord - existingFood.yCoord, 2)) <= 20) {
                return true;
            }
        }
        return false;
    }
}

function drawFoods() {
    for (i = 0; i < 5; i++) {
        var newFood = new food();
        while (newFood.overlapWith(foodList)) {
            newFood = new food();
        }
        newFood.draw();
        foodList.push(newFood);
    }
}

function removeFoods() {
    //TODO
}

function Bug() {
    "use strict";
    var alive = true;
    this.xCoord = Math.floor(Math.random() * 400);
    this.yCoord = 0;

    this.findNearestFood = function() {
        var minDist = Number.MAX_VALUE;
        var result = null;
        for (i = 0; i < foodList.length; i++) {
            var food = foodList[i];
            var dist = Math.sqrt(Math.pow(this.xCoord - food.xCoord, 2) + Math.pow(this.yCoord - food.yCoord, 2));
            if (food.eaton == false && dist < minDist) {
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
        return Math.atan2(this.targetFood.yCoord - this.yCoord, this.targetFood.xCoord - this.xCoord) + Math.PI / 2;
    }

    this.color = this.chooseColor();
    this.targetFood = this.findNearestFood();
    this.direction = this.getDirection();

    this.draw = function() {
        ctxGame.save();
        var path = new Path2D();
        

        ctxGame.fillStyle = this.color;
        ctxGame.strokeStyle = this.color;

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
        ctxGame.lineTo(5, 3);
        ctxGame.lineTo(6, 8);

        ctxGame.moveTo(0, -3);
        ctxGame.lineTo(-5, 3);
        ctxGame.lineTo(-6, 8);

        ctxGame.stroke();
        ctxGame.restore();
    }

    this.move = function() {
        this.targetFood = this.findNearestFood();
        var rightDirection = this.getDirection();
        if (this.direction - rightDirection > 0.01) {
            this.direction += ((rightDirection - this.direction) / 2);
        } else {
            this.xCoord += 10 * Math.sin(this.direction);
            this.yCoord -= 10 * Math.cos(this.direction);
        }
        ctxGame.save();
        ctxGame.translate(this.xCoord, this.yCoord);
        ctxGame.rotate(this.direction);
        ctxGame.clearRect(-7, -28, 14, 42);
        ctxGame.restore();
        this.draw();
    }
}

function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x >= 190 && x <= 220 && y >= 27 && y <=60) {
     changeState();
  }
}

