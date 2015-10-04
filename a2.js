var canvasGame = document.getElementById("gameView");
var ctxGame = canvasGame.getContext("2d");
ctxGame.fillStyle = "lightgrey";
ctxGame.fillRect(0,0,400,680);

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
drawBugs(xCoord, yCoord, color);




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
    var path=new Path2D();
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

function drawBugs(xCoord, yCoord, color) {
    var path = new Path2D();
    ctxGame.fillStyle = color;
    ctxGame.strokeStyle = color;

    path.arc(xCoord, yCoord, 4, 0, 2 * Math.PI, false);
    path.ellipse(xCoord, yCoord + 17, 13, 3, 90 * Math.PI/180, 0, 2 * Math.PI);
    ctxGame.fill(path);

    ctxGame.beginPath();

    ctxGame.moveTo(xCoord, yCoord);
    ctxGame.lineTo(xCoord - 5, yCoord - 10);

    ctxGame.moveTo(xCoord, yCoord);
    ctxGame.lineTo(xCoord + 5, yCoord - 10);

    ctxGame.moveTo(xCoord, yCoord + 14);
    ctxGame.lineTo(xCoord + 5, yCoord + 7);
    ctxGame.lineTo(xCoord + 6, yCoord + 2);

    ctxGame.moveTo(xCoord, yCoord + 14);
    ctxGame.lineTo(xCoord - 5, yCoord + 7);
    ctxGame.lineTo(xCoord - 6, yCoord + 2);

    ctxGame.moveTo(xCoord, yCoord + 13);
    ctxGame.lineTo(xCoord + 5, yCoord + 13);
    ctxGame.lineTo(xCoord + 5, yCoord + 16);

    ctxGame.moveTo(xCoord, yCoord + 13);
    ctxGame.lineTo(xCoord - 5, yCoord + 13);
    ctxGame.lineTo(xCoord - 5, yCoord + 16);

    ctxGame.moveTo(xCoord, yCoord + 14);
    ctxGame.lineTo(xCoord + 5, yCoord + 20);
    ctxGame.lineTo(xCoord + 6, yCoord + 25);

    ctxGame.moveTo(xCoord, yCoord + 14);
    ctxGame.lineTo(xCoord - 5, yCoord + 20);
    ctxGame.lineTo(xCoord - 6, yCoord + 25);

    ctxGame.stroke();
}

window.addEventListener("mousedown", doMouseDown, false);
function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x>=190 && x<=220 && y>=27 && y<=60) {
     changeState();
  }
}
