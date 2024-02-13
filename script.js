const gameBoard = (function(){
    let gameBoardArray = [["","",""],["","",""],["","",""]];

    const getGameBoard = () => gameBoardArray;

    const resetBoard = function() {

    }

    const isMoveLegal = function(row, column){
        return gameBoardArray[row][column] === '';
    }

    const makeMove = function(token, row, column){
        gameBoardArray[row][column] = token;
    }

    const validateMove = function(){
        
    }

    const showWinningTiles = function(){

    }

    return { getGameBoard, resetBoard, isMoveLegal, makeMove, validateMove, showWinningTiles }
})();

const gameLoop = (function(){

    let numberOfTurns = 0;
    let whoseTurn = 1;
    let player = {};

    const getNumberOfTurns = () => numberOfTurns;

    const increaseNumberOfTurns = () => numberOfTurns ++;

    const newGame = function() {
        player = createPlayer('X');
        computer = createPlayer('O');
    }

    const nextTurn = function() {
        if(whoseTurn) { 
            whoseTurn = 0;
            makePlayerMove();
        } else {
            whoseTurn = 1;
            makeComputerMove();
        }
    }

    const makeComputerMove = function() {
        console.log('I dont have a brain yet');
    }

    const makePlayerMove = function() {
        let playerMoveRow = prompt('Row?') - 1;
        let playerMoveColumn = prompt('Column?') - 1;

        if(gameBoard.isMoveLegal(playerMoveRow, playerMoveColumn)){
            gameBoard.makeMove(player.getToken(), playerMoveRow, playerMoveColumn);
        }

        updateBoard();
        nextTurn();
    }

    const updateBoard = function(){
        console.table(gameBoard.getGameBoard());
    }

    const win = function() {

    }
    
    newGame();
    nextTurn();

})();

function createPlayer(token){

    const getToken = () => token;

    return { getToken }
}