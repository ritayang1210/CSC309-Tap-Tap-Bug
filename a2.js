var canvasGame = document.getElementById("gameView");
var ctx = canvasGame.getContext("2d");
ctx.fillStyle = "lightgrey";
ctx.fillRect(0,0,400,680);

var canvasInfor = document.getElementById("inforBar");
var ctxInfor = canvasInfor.getContext("2d");
ctxInfor.font = "60px Courier New"
var timerfuc = setInterval(drawTimer, 1000);
var timer = 61;
var gameState = drawPause();
//var gameState = drawResume();

function scoreCounter() {
    document.getElementById("scoreCounter")
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
    }
    timer = timer - 1;
    ctxInfor.clearRect(0, 0, 100, 200);
    ctxInfor.fillText(timer + " sec", 10, 100, 50);
}

function drawPause() {
    var path=new Path2D();
    var rectangle = new Path2D();
    rectangle.rect(140, 50, 5, 60);
    rectangle.rect(150, 50, 5, 60);
    ctxInfor.fill(rectangle);

}
function drawResume() {
    var path=new Path2D();
    path.moveTo(160,80);
    path.lineTo(145,110);
    path.lineTo(145,50);
    ctxInfor.fill(path);
  }

window.addEventListener("mousedown", doMouseDown, false);
function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x>=30 && x<=60 && y>=30 && y<=60) {
     alert("BUTTON PRESSED")
  }
}
