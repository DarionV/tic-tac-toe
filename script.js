const gameBoard = (function(){
    let gameBoardArray = [["","",""],["","",""],["","",""]];

    const getGameBoard = () => gameBoardArray;

    const addTileToGameBoard = function(tile, row, column) {
        gameBoardArray[row][column] = tile;
    }

    const getGameBoardContainer = () => document.querySelector('.js-gameboard-container');

    const getNumberOfTiles = () => Math.pow(gameBoardArray.length, 2);

    const resetBoard = function() {}

    let token = '';

    const setToken = (value) => token = value;

    const getToken = () => token;

    const isMoveLegal = function(row, column){
        return gameBoardArray[row][column].getValue() === '';
    }

    const makeMove = function(row, column){
        gameBoardArray[row][column].setValue(token);

    }

    let winningTiles = [];

    const getWinningTiles = () => winningTiles;

    const validateMove = function(){

        let isWinningMove = false;
        
        

        // 1) check rows for winner
        gameBoardArray.forEach((row) => {
            if(row[0].getValue()!== '') {
                if(allEqual(row)) {
                    isWinningMove = true;
                    winningTiles = row;
                }
            }
        })

        // 2) check columns for winner
        for(let i = 0; i < gameBoardArray.length; i ++){
            let column = [];
            
            gameBoardArray.forEach((row)=>{
                column.push(row[i]);
            })
            if(column[0].getValue() !== '') {
                if(allEqual(column)) {
                    isWinningMove = true;
                    winningTiles = column;
                }
            }
        }

        // // 3) check diagonals for winner
        const firstDiagonal = [gameBoardArray[0][0], gameBoardArray[1][1], gameBoardArray[2][2]];
        const secondDiagonal = [gameBoardArray[0][2], gameBoardArray[1][1], gameBoardArray[2][0]];
        
        if (firstDiagonal[1].getValue() !== ''){
            if(allEqual(firstDiagonal)) {
                isWinningMove = true;
                winningTiles = firstDiagonal;
            }
            if(allEqual(secondDiagonal)) {
                isWinningMove = true;
                winningTiles = secondDiagonal;
            }
        }

        return isWinningMove;
    }

    const showWinningTiles = function(){

    }

    return { getGameBoard,getGameBoardContainer, resetBoard, isMoveLegal, 
        makeMove, validateMove, showWinningTiles, getNumberOfTiles, setToken, getToken, addTileToGameBoard, getWinningTiles}
})();

const displayController = (function(){
    
    const createTiles = (function(){
        const container = gameBoard.getGameBoardContainer();
        const gameBoardLength = gameBoard.getGameBoard().length;

        for(let row = 0; row < gameBoardLength; row ++){
            for(let column = 0; column < gameBoardLength; column ++){
                const newTile = createTile(row, column);
                gameBoard.addTileToGameBoard(newTile, row, column);
                container.appendChild(newTile.getTile());  
            }
        }
    })();

    const renderMessage = function(messageArray, delay = 0){
        let index = 0;

        setTimeout(()=>{

            for (let row = 0; row < gameBoard.getGameBoard().length; row ++) {
                for(let i = 0; i < gameBoard.getGameBoard().length; i ++){
                    gameBoard.getGameBoard()[row][i].setValue(messageArray[index]);
                    index ++;
                }
            }
            
        }, delay)
        
    }

    return { renderMessage }

})();


const gameLoop = (function(){

    const MAX_NUMBER_OF_TURNS = gameBoard.getNumberOfTiles();
    let numberOfTurns = 0;
    let whoseTurn = 1;
    let player = {};
    let computer = {};

    const newGame = function() {
        player = createPlayer('X');
        computer = createComputer('O');
    }

    const nextTurn = function() {

        //check for wins
        if(gameBoard.validateMove()) {
            win(gameBoard.validateMove());
            return
        }
        //check for ties
        if(numberOfTurns === MAX_NUMBER_OF_TURNS) {
            tie();
            return
        }

        numberOfTurns ++;

        if(whoseTurn) { 
            whoseTurn = 0;
            gameBoard.setToken(player.getToken());
        } else {
            whoseTurn = 1;
            gameBoard.setToken(computer.getToken());
            makeComputerMove();
        }
    }

    const makeComputerMove = function() {
        computer.calculateMove();      
    }

    const win = function() {
        console.log(gameBoard.getToken() + ' won!');
        gameBoard.getWinningTiles().forEach((e)=>{
            e.getTile().classList.add('locked');
        });

        gameBoard.getGameBoard().forEach((row)=>{
            row.forEach((e)=>{
                if(!e.getTile().classList.contains('locked')){
                    e.setValue('');
                }
                e.getTile().classList.remove('locked');
            })
        })
        
    }

    const tie = function(){
        console.log('TIE');
    }
    
    newGame();

    //Show welcome message, and after 2 seconds, start the game.
    displayController.renderMessage(['T','I','C','T','A','C','T','O','E']);
    displayController.renderMessage([''], 3000);

    return { nextTurn }

})();


function createTile(row, column){
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const getTile = () => tile;
    const getRow  = () => row;
    const getColumn = () => column;
    const getValue= () => tile.textContent; 
    const setValue = (value) => tile.textContent = value; //Make tile flip here later...

    tile.addEventListener('click', ()=>{

        if(gameBoard.isMoveLegal(row, column)) {
            gameBoard.makeMove(row, column);
            gameLoop.nextTurn();
        }
       
    });

    

    return { getTile, getRow, getColumn, getValue, setValue }
}

function createPlayer(token){

    const getToken = () => token;

    return { getToken }
}

function createComputer(token){
    const { getToken } = createPlayer(token);

    const calculateMove = function(){

        let computerMove = {};

         // 1) Always aim for the center in the beginning.
         if(gameBoard.getGameBoard()[1][1].getValue() === '') {
            gameBoard.makeMove(1, 1);
            gameLoop.nextTurn();
            return;
        }

        // 2) If center is taken, make a random move.

        const generateNewMove = function(){
            const row = getRandomInt(gameBoard.getGameBoard().length);
            const column = getRandomInt(gameBoard.getGameBoard().length);
            const isLegalMove = gameBoard.isMoveLegal(row, column);
            return { row, column, isLegalMove} 
        }

        do{
            computerMove = generateNewMove();
        } while (!computerMove.isLegalMove);

        gameBoard.makeMove(computerMove.row, computerMove.column);
        gameLoop.nextTurn();

    }

    return{ calculateMove, getToken }
g
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function allEqual(array){
    return array.every(function(element){
        return element.getValue() === array[0].getValue();
    });
}