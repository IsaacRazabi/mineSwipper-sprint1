var gHr = 0;
var gMin = 0;
var gSec = 0;
var gStoptime = true;
var gTimePassed = 0;
var gTimeCounterNow;
var gTimeCounter;
var gWiningTime;
var gFirstWin = 0;
var gTime;
var gTimer = document.querySelector(".timePassed")
var gBestTime = 0;
var gPlayer = "";
var gYourScore = document.querySelector(".yourScore");
var gBestScore = document.querySelector(".bestScore");

function startTimer() {
  if (gStoptime === true) {
    gStoptime = false;
    timerCycle();
  }
}
function stopTimer() {
  if (gStoptime === false) {
    gStoptime = true;
  }
}
function timerCycle() {
  if (gStoptime === false) {
    gSec = parseInt(gSec);
    gMin = parseInt(gMin);
    gHr = parseInt(gHr);

    gSec = gSec + 1;

    if (gSec === 60) {
      gMin = gMin + 1;
      gSec = 0;
    }
    if (gMin === 60) {
      gHr = gHr + 1;
      gMin = 0;
      gSec = 0;
    }

    if (gSec < 10 || gSec === 0) {
      gSec = "0" + gSec;
    }
    if (gMin < 10 || gMin === 0) {
      gMin = "0" + gMin;
    }
    if (gHr < 10 || gHr === 0) {
      gHr = "0" + gHr;
    }

    gTimer.innerHTML = gHr + ":" + gMin + ":" + gSec;

    setTimeout("timerCycle()", 1000);
  }
}
function resetTimer() {
  gTimer.innerHTML = "00:00:00";
  gStoptime = true;
  gHr = 0;
  gSec = 0;
  gMin = 0;
}
