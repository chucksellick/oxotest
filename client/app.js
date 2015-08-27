var app = angular.module("oxo", []);

app.controller("OxoController", function($scope,$timeout) {
    $scope.newGame = function(){
      $scope.board = [];
      for (var n=0;n<3;n++) {
        $scope.board.push([]);
        for (var m=0;m<3;m++){
          $scope.board[n].push({ x:m, y:n, player:null });
        }
      }
      // Pick whose turn it is (0=player, 1=computer)
      $scope.currentTurn = Math.floor(Math.random()*2);
      $scope.hasWon = false;
      $scope.noWinner = false;
      if ($scope.currentTurn === 1) {
        $scope.computerTurn();
      }
    }

    $scope.pickCell = function(cell){
      if ($scope.hasWon || $scope.currentTurn === 1) return;
      setCell(cell);
    }

    function setCell(cell) {
      if (cell.player === null) {
        cell.player = $scope.currentTurn;
        if (checkWinningCondition($scope.board,$scope.currentTurn)) {
          $scope.hasWon = true;
        }
        else {
          var cells = checkAvailableCells($scope.board);
          if (cells.length === 0) {
            $scope.noWinner = true;
            return;
          }
          $scope.currentTurn = 1 - $scope.currentTurn;
          if ($scope.currentTurn === 1) {
            $scope.computerTurn();
          }
        }
      }
    }

    $scope.computerTurn = function(){
      $timeout(function(){
        var cells = checkAvailableCells($scope.board);

        // Am I about to win? - check each available cell
        for (var n=0; n<cells.length; n++) {
          var testBoard = copyBoard($scope.board);
          var testCell = cells[n];
          testBoard[testCell.y][testCell.x].player = 1;
          if (checkWinningCondition(testBoard,1)){
            // Win the game
            setCell(testCell);
            return;
          }
        }

        // Is player about to win? - check each available cell
        for (var n=0; n<cells.length; n++) {
          var testBoard = copyBoard($scope.board);
          var testCell = cells[n];
          testBoard[testCell.y][testCell.x].player = 0;
          if (checkWinningCondition(testBoard,0)){
            // Block the player
            setCell(testCell);
            return;
          }
        }

        var picked = Math.floor(Math.random() * cells.length);
        setCell(cells[picked]);
      }, Math.random()*1500+500);
    };

    // Clone a board
    function copyBoard(board) {
      var copy = [];
      for (var n=0;n<3;n++) {
        copy.push([]);
        for (var m=0;m<3;m++){
          copy[n].push({ x:m, y:n, player:board[n][m].player });
        }
      }
      return copy;
    }

    function checkAvailableCells(board) {
      var cells = [];
      for (var n=0; n<3; n++) {
        for (var m=0; m<3; m++) {
          if (board[n][m].player === null) {
            cells.push(board[n][m]);
          }
        }
      }
      return cells;
    }

    function checkWinningCondition(board, player) {
      for (var n=0; n<3; n++) {
        var allH = true;
        var allV = true;
        for (var m=0; m<3; m++) {
          // Check horizontals
          if (board[m][n].player !== player) {
            allH = false;
          }
          // Check verticals
          if (board[n][m].player !== player) {
            allV = false;
          }
        }
        if (allH || allV) return true;
      }
      // Check diagonals
      var all1 = true;
      var all2 = true;
      for (var n=0;n<3;n++) {
        if (board[n][n].player !== player) all1 = false;
        if (board[n][2-n].player !== player) all2 = false;
      }
      if (all1 || all2) return true;
      return false;
    }
  });