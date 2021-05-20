"use strict";

var gBoard;
var gInterval;
var gTrueFlages = 0;
var gIsFirstMove = true;
var gLevel = {
        SIZE: 4,
        MINES: 2,
}

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

 init();

function init() {  
  gBoard = buildBoard();
  document.querySelector(".win").innerText= '🙂';
  var time = 0;
  gIsFirstMove = true;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
  gTrueFlages = 0;
  gInterval = setInterval(function () {
    time += 1;
    var elTimePassed = document.querySelector(".timePassed");
    elTimePassed.innerText = `${time}`;
  }, 1000);
  renderBoard(gBoard);
}



// create an empty matrix
function createMat(length) {
  var mat = [];
  for (var i = 0; i < length; i++) {
    mat[i] = [];
    for (var j = 0; j < length; j++) {
      mat[i][j] = "";
    }
  }
  return mat;
}
// bealding the MODAL  - KEEPING DATA
function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        minesAroundCount: 4,
        isShown: true,
        isMine: false,
        isMarked: true,
        isFlag: false,
      };
      board[i][j] = cell;
    }
  }
  // changing .ismine change all the mat !

  return board;
}

// BULDING THE DISPLAY OF THE PAGE BY HTML
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board.length; j++) {
      //   var currCell = board[i][j];
      var cellClass = getClassName({ i: i, j: j }); // returne string of form : 'cell-0-0'
      cellClass += " floor ";
      //gice them class of mine
      //   if (board[i][j].isMine) {
      //     cellClass += "mine";
      //   }
      strHTML += `\t<td  class="cell ${cellClass}" onclick="cellClicked(${i},${j})" >\n`;
      //   if (board[i][j].isMine) {
      //       strHTML +=`${MINE}` ;
      //   }
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
}

function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}

function getLocationByClassName(className) {
  var num = className.match(/\d/g); // reg exp : g =  work on all matches.
  num = num.join("");
  var locationI = num[0];
  var locationJ = num[1];
  return { i: locationI, j: locationJ };
}

function setMinesNegsCount(board) {}

function getEmptyCells() {
  var empty = [];
  for (var i = 1; i < gBoard.length - 1; i++) {
    for (var j = 1; j < gBoard[0].length - 1; j++) {
      var currCell = gBoard[i][j];
      if (!currCell.gameElement) empty.push({ i, j });
    }
  }
  return empty;
}

function countMineNegs(mat, pos) {
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
      neg(gBoard, positions[i]);
      gBoard[positions[i].i][positions[i].j].isShown = false;
      gGame.shownCount++;
    }
  }
  renderCell(pos, count);
  var statsShown = document.querySelector(".statsShown");
  statsShown.innerText = `cells showen : ${gGame.shownCount} `;
}
function neg(mat, positions) {
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

function cellClicked(posI, posJ) {
  if (gIsFirstMove) {
for (var i = 0;i< gLevel.MINES; i++) {
    gBoard[drawNum().i][drawNum().j].isMine = true;    
}
// gBoard[drawNum().i][drawNum().j].isMine = true;
//     gBoard[drawNum().i][drawNum().j].isMine = true;
    gIsFirstMove = false;
  }
  gBoard[posI][posJ].isShown = false;
  if (gBoard[posI][posJ].isFlag) return;
  gGame.shownCount++;
  var statsShown = document.querySelector(".statsShown");
  statsShown.innerText = `cells showen : ${gGame.shownCount} `;
  if (!gBoard[posI][posJ].isMine) {
    countMineNegs(gBoard, { i: posI, j: posJ });
  } else {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (!gBoard[i][j].isMine) continue;
        var cellSelector = "." + getClassName({ i: i, j: j });
        var elCell = document.querySelector(cellSelector);
        elCell.classList.toggle("mine");
        renderCell({ i: i, j: j }, MINE);
      }
    }
    gameOver();
  }
  cheakVictory();
}

function drawNum() {
  var idxI = getRandomInt(0, gLevel.SIZE - 1);
  var idxJ = getRandomInt(0, gLevel.SIZE - 1);
  var num = { i: idxI, j: idxJ };
  return num;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function gameOver() {
  var elGameStat = document.querySelector(".gameStat");
  elGameStat.innerText = "game over !";
  document.querySelector(".win").innerText='😤'
  setTimeout(init, 1000);
  clearInterval(gInterval);
  gInterval=null;
}

function flag(event) {
  var pos = event.target;
  getLocationByClassName(pos.className);
  var isCellFlag =
    gBoard[getLocationByClassName(pos.className).i][
      getLocationByClassName(pos.className).j
    ];
  if (isCellFlag.isFlag) {
    pos.innerText = "";
    isCellFlag.isFlag = false;
    gGame.markedCount--;
    if (isCellFlag.isMine) {
      gTrueFlages--;
    }
  } else if (!isCellFlag.isFlag) {
    if(!isCellFlag.isShown) return
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

function cheakVictory() {
  var numOfCells = gLevel.SIZE ** 2;
  if (numOfCells - gGame.shownCount - gTrueFlages === 0) {
    alert("YOU WON !");
    document.querySelector(".win").innerText='😎'
    setTimeout(init, 1000);
    clearInterval(gInterval);
    gInterval=null;
  }
}
function gameLevel() {
    var level = (document.querySelector(".level").value)

    if (level === 'Medium' ) {
        gLevel. SIZE = 8;
        gLevel.MINES = 12;
        clearInterval(gInterval)
        gInterval=null;
        init()
    }

    if (level ===  'Expert' ) {
            gLevel. SIZE = 12;
            gLevel.MINES = 30;
            clearInterval(gInterval)
            gInterval=null;
            init()
 }
}

