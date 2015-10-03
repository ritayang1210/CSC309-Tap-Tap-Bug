// var canvas = document.getElementById("startView");
// var ctx = canvas.getContext("2d");
// ctx.fillStyle = "lightgrey";
// ctx.fillRect(0,0,400,650);


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
    } else {
        alert("Sorry! No Web Storage support");
    }
}