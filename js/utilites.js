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