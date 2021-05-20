"use strict";

var gBoard;
var gInterval;
var gTrueFlages = 0;
var gIsFirstMove = true;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gCount = gLevel.SIZE;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
const MINE = "💣";
const FLAG = "🚩";
var gIsHitMine = false;
var gIsFlag = false;
var gLife = 3;
var gLastPos = [];

function init() {
  gBoard = buildBoard();
  document.querySelector(".win").innerText = "🙂";
  document.querySelector(".gameStat").innerText = "";
  gIsFirstMove = true;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
  gTrueFlages = 0;
  gLife = 3;
  renderBoard(gBoard);
}

// bealding the MODAL  - KEEPING DATA
function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        // minesAroundCount: 4,
        isShown: true,
        isMine: false,
        isMarked: true,
        isFlag: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

// BULDING THE DISPLAY OF THE PAGE BY rending to DOM
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board.length; j++) {
      var cellClass = getClassName({ i: i, j: j }); // returne string of form : 'cell-0-0'
      cellClass += " floor ";
      strHTML += `\t<td  class="cell ${cellClass}" onclick="cellClicked(${i},${j})" >\n`;
      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
  var statsShown = document.querySelector(".statsShown");
  statsShown.innerText = `cells showen : ${gGame.shownCount} `;
  var statsMarked = document.querySelector(".statsMarked");
  statsMarked.innerText = `cells marked : ${gGame.markedCount} `;
  var elLife = document.querySelector(".life");
  elLife.innerText = ` lives left : ${gLife}`;
}
// responsable to every response to click event
function cellClicked(posI, posJ) {
  if (gIsFirstMove) {
    for (var i = 0; i < gLevel.MINES; i++) {
      var location = drawNum();
      gBoard[location.i][location.j].isMine = true;
    }
    startTimer();
    var dateObjbegin = new Date();
    var timeCounter = dateObjbegin.getTime();
    gIsFirstMove = false;
  }
  if (gBoard[posI][posJ].isShown === false) return ;
  if (gBoard[posI][posJ].isFlag) return;
  if (gLastPos[0] === posI && gLastPos[1] === posJ) return;
  else if (gBoard[posI][posJ].isShown === true) gBoard[posI][posJ].isShown = false;
  var statsShown = document.querySelector(".statsShown");
  statsShown.innerText = `cells showen : ${gGame.shownCount} `;
  if (!gBoard[posI][posJ].isMine) {
    gGame.shownCount++;
    cheakNeighbors(gBoard, { i: posI, j: posJ });
  } else if (gBoard[posI][posJ].isMine) {
    gLife--;
    var elLife = document.querySelector(".life");
    elLife.innerText = ` lives left : ${gLife}`;
    var cellSelector = "." + getClassName({ i: posI, j: posJ });
    var elCell = document.querySelector(cellSelector);
    elCell.classList.add("mine");
    renderCell({ i: posI, j: posJ }, MINE);
    setTimeout(() => {
      gBoard[posI][posJ].isShown = true;
      elCell.classList.remove("mine");
      renderCell({ i: posI, j: posJ }, "");
    }, 1000);

    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (!gBoard[i][j].isMine) continue;
        if (gLife + 1 > 0) return;
        var cellSelector = "." + getClassName({ i: i, j: j });
        var elCell = document.querySelector(cellSelector);
        elCell.classList.add("mine");
        renderCell({ i: i, j: j }, MINE);
      }
    }
    gameOver();
  }
  cheakVictory();
  gLastPos = [posI, posJ];
}
// responsable to cheak direct neighbors
function cheakNeighbors(mat, pos) {
  var positions = [];
  var count = 0;
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > mat.length - 1) continue;
      if (i === pos.i && j === pos.j) continue;
      if (mat[i][j].isMine) {
        count++;
      } else {
        if (mat[i][j].isFlag === true) continue;
        positions.push({ i, j });
      }
    }
  }
  if (count === 0) {
    for (var i = 0; i < positions.length; i++) {
      cheakNeighborsOfNeighbors(gBoard, positions[i]);
      gBoard[positions[i].i][positions[i].j].isShown = false;
      gGame.shownCount++;
    }
  }
  renderCell(pos, count);
  var statsShown = document.querySelector(".statsShown");
  statsShown.innerText = `cells showen : ${gGame.shownCount} `;
}
// responsable to cheak  neighbors of neighbors
function cheakNeighborsOfNeighbors(mat, positions) {
  var count = 0;
  for (var i = positions.i - 1; i <= positions.i + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = positions.j - 1; j <= positions.j + 1; j++) {
      if (j < 0 || j > mat.length - 1) continue;
      if (mat[i][j].isMine) {
        count++;
      }
    }
  }
  renderCell(positions, count);
}
//render specific cell
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}
//game over
function gameOver() {
  var elGameStat = document.querySelector(".gameStat");
  elGameStat.innerText = "game over !";
  resetTimer();
  document.querySelector(".win").innerText = "😤";
  setTimeout(init, 2000);
  clearInterval(gInterval);
  gInterval = null;
}
// responsable on right click event
function flag(event) {
  var pos = event.target;
  getLocationByClassName(pos.className);
  var isCellFlag =
    gBoard[getLocationByClassName(pos.className).i][
      getLocationByClassName(pos.className).j
    ];
   if (!isCellFlag.isShown) return;
  if (isCellFlag.isFlag) {
    pos.innerText = "";
    isCellFlag.isFlag = false;
    gGame.markedCount--;
    if (isCellFlag.isMine) {
      gTrueFlages--;
    }
  } else if (!isCellFlag.isFlag) {
    pos.innerText = FLAG;
    isCellFlag.isFlag = true;
    gGame.markedCount++;
    if (isCellFlag.isMine) {
      gTrueFlages++;
    }
    cheakVictory();
  }

  var statsMarked = document.querySelector(".statsMarked");
  statsMarked.innerText = `cells marked :  ${gGame.markedCount}`;
}
// responsable to cheak win
function cheakVictory() {
  var numOfCells = gLevel.SIZE ** 2;
  if (numOfCells - gGame.shownCount - gTrueFlages === 0) {
    stopTimer();

    // work in progress on bounos
    // const dateObjbeginFliped = new Date();
    // timeCounterNow = dateObjbeginFliped.getTime();
    // timePassed = parseInt((timeCounterNow - timeCounterFirstFlip) / 1000);
    // if (timePassed > bestTime) {
    //   if (firstWin === 0) {
    //     bestTime = timePassed;
    //     firstWin++;
    //   }
    // } else {
    //   bestTime = timePassed;
    // }
    // localStorage.setItem("currante time", timePassed);
    // localStorage.setItem("best time", bestTime);
    // time = localStorage.getItem("currante time");
    // winingTime = localStorage.getItem("best time");

    // yourScore.innerHTML = `your score is: ${time}`;
    // bestScore.innerHTML = `the best time is : ${winingTime}`;
    // if (winingTime === time) {
    //   // alert("you have reached the bset time ! well done ! ");
    // }

    document.querySelector(".win").innerText = "😎";
    document.querySelector(".gameStat").innerText = "you won ! well done !";
    resetTimer();
    setTimeout(init, 2000);
    clearInterval(gInterval);
    gInterval = null;
  }
}
// choose game level by user
function gameLevel() {
  var level = document.querySelector(".level").value;

  if (level === "Medium") {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    clearInterval(gInterval);
    gInterval = null;
    init();
  }

  if (level === "Expert") {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    clearInterval(gInterval);
    gInterval = null;
    init();
  }
}
