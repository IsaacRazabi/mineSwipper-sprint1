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
   // return class by location
  function getClassName(location) {
    var cellClass = "cell-" + location.i + "-" + location.j;
    return cellClass;
  }
   // return location by class
  function getLocationByClassName(className) {
    var num = className.match(/\d/g); // reg exp : g =  work on all matches.
    num = num.join("");
    var locationI = num[0];
    var locationJ = num[1];
    return { i: locationI, j: locationJ };
  }
  // returne object with random idxs
  function drawNum() {
    var idxI = getRandomInt(0, gLevel.SIZE - 1);
    var idxJ = getRandomInt(0, gLevel.SIZE - 1);
    var num = { i: idxI, j: idxJ };
    return num;
  }
  // get random number
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }
  