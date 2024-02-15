const gameBoard = (function(){
    let gameBoardArray = [["","",""],["","",""],["","",""]];

    const getGameBoard = () => gameBoardArray;

    const getNumberOfTiles = () => Math.pow(gameBoardArray.length, 2);

    const resetBoard = function() {

    }

    const isMoveLegal = function(row, column){
        return gameBoardArray[row][column] === '';
    }

    const makeMove = function(token, row, column){
        gameBoardArray[row][column] = token;
    }

    const validateMove = function(){

        let isWinningMove = false;

        // 1) check rows for winner
        gameBoardArray.forEach((row) => {
            if(row[0]!== '') {
                if(allEqual(row)) isWinningMove = true;
            }
        })

        // 2) check columns for winner
        for(let i = 0; i < gameBoardArray.length; i ++){
            let column = [];
            
            gameBoardArray.forEach((row)=>{
                column.push(row[i]);
            })
            if(column[0] !== '') {
                if(allEqual(column)) isWinningMove = true;
            }
        }

        // 3) check diagonals for winner
        const firstDiagonal = [gameBoardArray[0][0], gameBoardArray[1][1], gameBoardArray[2][2]];
        const secondDiagonal = [gameBoardArray[0][2], gameBoardArray[1][1], gameBoardArray[2][0]];
        
        if (firstDiagonal[1] !== ''){
            if(allEqual(firstDiagonal) || allEqual(secondDiagonal)) isWinningMove = true;
        }

        return isWinningMove;
    }

    
       

    const showWinningTiles = function(){

    }

    return { getGameBoard, resetBoard, isMoveLegal, makeMove, validateMove, showWinningTiles, getNumberOfTiles }
})();

const gameLoop = (function(){

    const MAX_NUMBER_OF_TURNS = gameBoard.getNumberOfTiles;
    let numberOfTurns = 0;
    let whoseTurn = 1;
    let player = {};
    let computer = {};

    const getNumberOfTurns = () => numberOfTurns;

    const increaseNumberOfTurns = () => numberOfTurns ++;

    const newGame = function() {
        player = createPlayer('X');
        computer = createComputer('O');
    }

    const nextTurn = function() {
        updateBoard();
        console.log('validate move: ' + gameBoard.validateMove())
        if(gameBoard.validateMove()) win();

        if(whoseTurn) { 
            whoseTurn = 0;
            makePlayerMove();
        } else {
            whoseTurn = 1;
            makeComputerMove();
        }
    }

    const makeComputerMove = function() {
        const computerMove = computer.calculateMove();
        gameBoard.makeMove(computer.getToken(), computerMove.row, computerMove.column);
        nextTurn();        
    }

    const makePlayerMove = function() {
        let playerMoveRow = prompt('Row?') - 1;
        let playerMoveColumn = prompt('Column?') - 1;

        if(gameBoard.isMoveLegal(playerMoveRow, playerMoveColumn)) 
            gameBoard.makeMove(player.getToken(), playerMoveRow, playerMoveColumn);
         else makePlayerMove();

        nextTurn();
    }

    const updateBoard = function(){
        console.clear();
        console.table(gameBoard.getGameBoard());
    }

    const win = function() {
        console.log('someone won!');
    }
    
    newGame();
    nextTurn();

})();

function createPlayer(token){

    const getToken = () => token;

    return { getToken }
}

function createComputer(token){
    const { getToken } = createPlayer(token);

    const calculateMove = function(){

        let computerMove = {};

         // 1) Always aim for the center in the beginning.
         if(gameBoard.getGameBoard()[1][1]==='') {
            computerMove.row = 1;
            computerMove.column = 1;
            return computerMove
        }

        // 2) If center is taken, make a random move.
        const generateRandomMove = function(){
    
            const generateNewMove = function(){
                const row = getRandomInt(gameBoard.getGameBoard().length);
                const column = getRandomInt(gameBoard.getGameBoard()[row].length);
                const isLegalMove = gameBoard.isMoveLegal(row, column);
                return { row, column, isLegalMove} 
            }
    
            do{
                computerMove = generateNewMove();
            } while (!computerMove.isLegalMove);
            return computerMove
        }

        return generateRandomMove();
    }

    return{ calculateMove, getToken }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function allEqual(array){
    return array.every(function(element){
        return element === array[0];
    });
}