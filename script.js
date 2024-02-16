const gameBoard = (function(){
    let gameBoardArray = [["","",""],["","",""],["","",""]];

    const getGameBoard = () => gameBoardArray;

    const addTileToGameBoard = function(tile, row, column) {
        gameBoardArray[row][column] = tile;
    }

    const getAllTiles = function(){
        let allTiles = [];

        for (let row = 0; row < gameBoardArray.length; row ++) {
            for(let i = 0; i < gameBoardArray.length; i ++){
                allTiles.push(gameBoardArray[row][i]);
            }
        }

        return allTiles;
    }

    const getGameBoardContainer = () => document.querySelector('.js-gameboard-container');

    const getNumberOfTiles = () => Math.pow(gameBoardArray.length, 2);

    const resetBoard = function() {
        getAllTiles().forEach((tile)=>{
            tile.setValue('');
            tile.getTile().classList.remove('marked');
            })
    }

    let token = '';

    const setToken = (value) => token = value;

    const getToken = () => token;

    const isMoveLegal = function(row, column){
        return gameBoardArray[row][column].getToken() === '';
    }

    const lockTiles = function(){
        getAllTiles().forEach((tile) =>{
            tile.getTile().classList.add('non-clickable');
        })
    }

    const unlockTiles = function(){
        getAllTiles().forEach((tile) =>{
            tile.getTile().classList.remove('non-clickable');
        })
    }

    const makeMove = function(row, column){
        // gameBoardArray[row][column].setValueWithFlip(token);
        gameBoardArray[row][column].getTile().classList.add('marked');
        gameBoardArray[row][column].setToken(token);

    }

    let winningTiles = [];

    const getWinningTiles = () => winningTiles;

    const validateMove = function(){

        let isWinningMove = false;
        
        

        // 1) check rows for winner
        gameBoardArray.forEach((row) => {
            if(row[0].getToken()!== '') {
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
            if(column[0].getToken() !== '') {
                if(allEqual(column)) {
                    isWinningMove = true;
                    winningTiles = column;
                }
            }
        }

        // // 3) check diagonals for winner
        const firstDiagonal = [gameBoardArray[0][0], gameBoardArray[1][1], gameBoardArray[2][2]];
        const secondDiagonal = [gameBoardArray[0][2], gameBoardArray[1][1], gameBoardArray[2][0]];
        
        if (firstDiagonal[1].getToken() !== ''){
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

    return { getGameBoard,getGameBoardContainer, resetBoard, isMoveLegal, 
        makeMove, validateMove, getNumberOfTiles, setToken, 
        getToken, addTileToGameBoard, getWinningTiles, getAllTiles, lockTiles, unlockTiles}
})();

const displayController = (function(){
    
    const createTiles = (function(){
        const container = gameBoard.getGameBoardContainer();
        const gameBoardLength = gameBoard.getGameBoard().length;

        for(let row = 0; row < gameBoardLength; row ++){
            for(let column = 0; column < gameBoardLength; column ++){
                const newTile = createTile(row, column);
                gameBoard.addTileToGameBoard(newTile, row, column);
                container.appendChild(newTile.getContainer());  

                // const newTileShadow = document.createElement('div');
                // newTileShadow.classList.add('shadow');
                // document.querySelector('.js-shadow-container').appendChild(newTileShadow);
            }
        }
    })();

    const renderMessage = function(messageArray, shouldFlip){
        let index = 0;

        for (let row = 0; row < gameBoard.getGameBoard().length; row ++) {
            for(let i = 0; i < gameBoard.getGameBoard().length; i ++){

                if(shouldFlip) gameBoard.getGameBoard()[row][i].setValueWithFlip(messageArray[index]);
                else gameBoard.getGameBoard()[row][i].setValue(messageArray[index]);

                index ++;
            }
        }
    }

    const renderScore = function(playerToken, computerToken, playerScore, compterScore){
        renderMessage([playerToken, '', computerToken, playerScore, '-', compterScore,'','',''])
    }

    return { renderMessage, renderScore }

})();


const gameLoop = (function(){

    const MAX_NUMBER_OF_TURNS = gameBoard.getNumberOfTiles();
    const ANIMATION_DURATION_IN_MS = 500;
    let numberOfTurns = 0;
    let whoseTurn = 1;
    let player = {};
    let computer = {};

    const getAnimationDurationInMs = () => ANIMATION_DURATION_IN_MS;

    const initializeGame = function() {
        player = createPlayer('cross');
        computer = createComputer('circle');

        // 1 = player's turn.
        // 0 = computer's turn.
        whoseTurn = 1;
        lastToBegin = 1;

        //Show welcome message, and after 2 seconds, start the game.
        gameBoard.lockTiles();
        displayController.renderMessage(['T','I','C','T','A','C','T','O','E']);
        setTimeout(()=>{
            displayController.renderMessage([''], true);
        }, 2000)
        setTimeout(gameBoard.unlockTiles,2000);

        setTimeout(nextTurn, 2000 + ANIMATION_DURATION_IN_MS);
    }

    const newGame = function(displayScore){

        if(displayScore){
            //Display score (after delay)
            setTimeout(()=>{
                displayController.renderScore(player.getToken(),computer.getToken(),player.getScore(),computer.getScore());
            }, 2000);
        }

         //Reset game board (after delay)
         setTimeout(gameBoard.resetBoard, 4000);

        numberOfTurns = 0;
        
        //Decide who will go first
        if(lastToBegin) {
            whoseTurn = 0;
            lastToBegin = 0;
        } else {
            whoseTurn = 1;
            lastToBegin = 1;
        }

        setTimeout(nextTurn, 4000);

    }

    const nextTurn = function() {

        //check for wins
        if(gameBoard.validateMove()) {
            setTimeout(()=>{
                win(gameBoard.validateMove());
            }, 500);
            
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
            gameBoard.unlockTiles();
        } else {
            whoseTurn = 1;
            gameBoard.setToken(computer.getToken());
            makeComputerMove();
        }
    }

    const makeComputerMove = function() {
        setTimeout(computer.calculateMove, 500);     
    }

    const win = function() {

        gameBoard.lockTiles();

        whoseTurn ? computer.increaseScore() : player.increaseScore();

        //lock winning tiles for editing
        gameBoard.getWinningTiles().forEach((e)=>{
            e.getTile().classList.add('locked');
        });
        //edit the losing tiles and then unlock all
        gameBoard.getGameBoard().forEach((row)=>{
            row.forEach((e)=>{
                if(!e.getTile().classList.contains('locked')){
                    e.setValue('');
                }
                e.getTile().classList.remove('locked');
            })
        })

        newGame(true);
    }

    const tie = function(){
        displayController.renderMessage(['','','','T','I','E','','',''],1000);
        newGame(false);
    }
    
    initializeGame();

    return { nextTurn, getAnimationDurationInMs }

})();


function createTile(row, column){
    const container = document.createElement('div');
    container.classList.add('tile-container');

    const tile = document.createElement('div');
    tile.classList.add('tile');
    container.appendChild(tile);

    //Edge element that is only visible during flip animation
    const edge = document.createElement('div');
    edge.classList.add('edge');
    container.appendChild(edge);

    //Shadow element 
    const shadow = document.createElement('div');
    shadow.classList.add('shadow');
    container.appendChild(shadow);

    let token = '';

    const getToken = () => token;
    const setToken = function(newToken) {
        flip();
        token = newToken;
        setTimeout(()=>{
            tile.classList.add(token);
        }, gameLoop.getAnimationDurationInMs() / 2)
    } 

    const getTile = () => tile;
    const getContainer = () => container;
    const getRow  = () => row;
    const getColumn = () => column;
    const getValue= () => tile.textContent; 
    const setValue = function (value) {
            tile.textContent = value;
    }

    const setValueWithFlip = function(value){
        flip();
        setTimeout(()=>{
            tile.textContent = value;
        }, gameLoop.getAnimationDurationInMs() / 2);
    }

    const flip = function() {
        container.classList.add('flip');
        setTimeout(()=>{
            container.classList.remove('flip');
        }, gameLoop.getAnimationDurationInMs() + 100);
    }

    tile.addEventListener('click', ()=>{

        if(tile.classList.contains('non-clickable')) return;

        if(gameBoard.isMoveLegal(row, column)) {
            gameBoard.makeMove(row, column);
            gameLoop.nextTurn();
            tile.classList.remove('cursor');
            gameBoard.lockTiles();
        }
       
    });    

    return { getTile, getRow, getColumn, getValue, setValue, getContainer, setValueWithFlip, setToken, getToken}
}

function createPlayer(token){

    let score = 0;

    const getToken = () => token;
    const getScore = () => score;
    const increaseScore = () => score ++;

    return { getToken, getScore, increaseScore }
}

function createComputer(token){
    const { getToken, getScore, increaseScore  } = createPlayer(token);

    const calculateMove = function(){

        let computerMove = {};

         // 1) Always aim for the center in the beginning.
         if(gameBoard.getGameBoard()[1][1].getToken() === '') {
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

    return{ calculateMove, getToken, getScore, increaseScore }
g
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function allEqual(array){
    return array.every(function(element){
        return element.getToken() === array[0].getToken();
    });
}