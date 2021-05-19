"use strict";

var gBoard;

function init() {
    gBoard =  buildBoard();
    renderBoard(gBoard)
}

// bealding the board and create every cell
function buildBoard() {
  var board = createMat(4);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = {
        type: null,
        gameElement: null,
        isMine: false,
        isEmpty: true,
      };
      board[i][j] = cell;
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

      // var cellClass = getClassName({ i: i, j: j });

      // cellClass += currCell.type === FLOOR ? " floor" : " wall";
    //   class="cell ${cellClass}"

      strHTML += `\t<td> "S " \n`;
      strHTML += `\t</td>\n`;
    }
    strHTML += "</tr>\n";
    console.log(strHTML);
  }

  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

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
