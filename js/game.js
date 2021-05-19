"use strict";

var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
const MINE = "💣";

function init() {
  gBoard = buildBoard();
  renderBoard(gBoard);
}

// bealding the board and create every cell
function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        minesAroundCount: 4,
        isShown: true,
        isMine: false,
        isMarked: true,
      };
      board[i][j] = cell;
      if ((i===0 && j ===1) || (i===2 && j===3)) {
        board[i][j] = MINE
      }
    }
  }


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
      if (i===0 && j ===1) cellClass+= 'mine';
      if(i===2 && j===3) cellClass+= 'mine';
      //  do condtion og the class each cell get
      strHTML += `\t<td  class="cell ${cellClass}" onclick="moveTo(${i},${j})" >\n`;
      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
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
