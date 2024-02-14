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
    let computer = {};

    const getNumberOfTurns = () => numberOfTurns;

    const increaseNumberOfTurns = () => numberOfTurns ++;

    const newGame = function() {
        player = createPlayer('X');
        computer = createComputer('O');
    }

    const nextTurn = function() {
        updateBoard();

        if(whoseTurn) { 
            whoseTurn = 0;
            makePlayerMove();
        } else {
            whoseTurn = 1;
            makeComputerMove();
        }
    }

    const makeComputerMove = function() {

        console.log(computer.calculateMove());
        
        // gameBoard.makeMove(computer.getToken, randomRow, randomColumn);
        
    }

    const makePlayerMove = function() {
        let playerMoveRow = prompt('Row?') - 1;
        let playerMoveColumn = prompt('Column?') - 1;

        if(gameBoard.isMoveLegal(playerMoveRow, playerMoveColumn)){
            gameBoard.makeMove(player.getToken(), playerMoveRow, playerMoveColumn);
        }
        nextTurn();
    }

    const updateBoard = function(){
        console.clear();
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

function createComputer(token){
    const { getToken } = createPlayer(token);

    const calculateMove = function(){

        let computerMove = [];

         //Always aim for the center in the beginning.
         if(gameBoard.getGameBoard()[1][1]==='') {
            computerMove = [1,1];
            return computerMove
        }

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