"use strict";

var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gCount = gLevel.SIZE;
var gCell = {
  minesAroundCount: 4,
  isShown: true,
  isMine: false,
  isMarked: true,
};

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
const MINE = "💣";

function init() {
  gBoard = buildBoard();
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
// bealding the board and create every cell
function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j] = gCell;
    }
  }
  // changing .ismine change all the mat !
  board[drawNum().i][drawNum().j] = {
    minesAroundCount: 4,
    isShown: true,
    isMine: true,
    isMarked: true,
  };
  board[drawNum().i][drawNum().j] = {
    minesAroundCount: 4,
    isShown: true,
    isMine: true,
    isMarked: true,
  };
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board.length; j++) {
      //   var currCell = board[i][j];
      var cellClass = getClassName({ i: i, j: j }); // returne string of form : 'cell-0-0'
      cellClass += " floor ";
      //gice them class of mine
      if (board[i][j].isMine) {
        cellClass += "mine";
      }
      strHTML += `\t<td  class="cell ${cellClass}" onclick="cellClicked(${i},${j})" >\n`;
      if (board[i][j].isMine) {
        strHTML += MINE;
      }
      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
  }

  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
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
        positions.push({i,j});
      }
    }
  }
  for (var i = 0; i < positions.length; i++) {
    renderCell(positions[i], count);
  }
}

function cellClicked(posI, posJ) {
  gCell.isShown = false;
  if (!gBoard[posI][posJ].isMine) countMineNegs(gBoard, { i: posI, j: posJ });
  else {
    gameOver();
  }
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
  init();
}
