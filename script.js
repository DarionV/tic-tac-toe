const gameBoard = (function(){
    let gameBoardArray = [["","",""],["","",""],["","",""]];
    let winningTiles = []; //used to hide all other tiles after win
    let token = '';

    const getWinningTiles = () => winningTiles;

    const setToken = (value) => token = value;

    const getToken = () => token;

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

    const getColumns = () => {
        let columns = [];
        for(let i = 0; i < gameBoardArray.length; i ++){
            let column = [];
            gameBoardArray.forEach((row)=>{
                column.push(row[i]);
            })
            columns.push(column);
        }
        return columns;
    }

    const getDiagonals = () => {
        let diagonals = [];
        const firstDiagonal = [gameBoardArray[0][0], gameBoardArray[1][1], gameBoardArray[2][2]];
        const secondDiagonal = [gameBoardArray[0][2], gameBoardArray[1][1], gameBoardArray[2][0]];
        diagonals.push(firstDiagonal, secondDiagonal);
        return diagonals;
    }

    const getGameBoardContainer = () => document.querySelector('.js-gameboard-container');

    const resetBoard = function() {
        soundController.flip();
        getAllTiles().forEach((tile)=>{
                if(tile.getValue() !== '')tile.setValueWithFlip('');
                if(tile.getToken() !== '')tile.setToken('');
                tile.getTile().classList.remove('marked');
            })
    }

    const resetBoardWithWaveAnimation = function(speed = 100){
        let delay = 100;

        for(let i = 0; i < getAllTiles().length; i++){
            setTimeout(() => {
                if(getAllTiles()[i].getValue() !== '')getAllTiles()[i].setValueWithFlip('');
                if(getAllTiles()[i].getToken() !== '')getAllTiles()[i].setToken('');
                getAllTiles()[i].getTile().classList.remove('marked');
            }, delay)

            delay += speed;
        }
    }

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
        soundController.flip();
        gameBoardArray[row][column].getTile().classList.add('marked');
        gameBoardArray[row][column].setToken(token);

    }

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
        getColumns().forEach((column) => {
            if(column[0].getToken() !== '') {
                if(allEqual(column)) {
                    isWinningMove = true;
                    winningTiles = column;
                }
            }
        })

        // // 3) check diagonals for winner
        const firstDiagonal = getDiagonals()[0];
        const secondDiagonal = getDiagonals()[1];
        
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
    return { getGameBoard,getGameBoardContainer, resetBoard, resetBoardWithWaveAnimation, isMoveLegal, 
             makeMove, validateMove, setToken, getToken, addTileToGameBoard, getWinningTiles, 
             getAllTiles, lockTiles, unlockTiles, getColumns, getDiagonals}
})();

const soundController = (function(){
    
    const flip = () => {
        const audio_tileFlip = new Audio ('audio/chip.mp3')
        audio_tileFlip.volume = 0.5;
        audio_tileFlip.play();
        setTimeout(audio_tileFlip.destroy, 1000);
    }

    return { flip }
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
            }
        }
    })();

    const renderMessage = function(messageArray, shouldFlip){
        let index = 0;

        for (let row = 0; row < gameBoard.getGameBoard().length; row ++) {
            for(let i = 0; i < gameBoard.getGameBoard().length; i ++){

                if(shouldFlip) {
                    if(gameBoard.getGameBoard()[row][i].getValue() !== messageArray[index] ||
                    gameBoard.getGameBoard()[row][i].getToken() !== messageArray[index]){
                        gameBoard.getGameBoard()[row][i].setValueWithFlip(messageArray[index]);
                        gameBoard.getGameBoard()[row][i].setToken('');
                    }
                }
                else {
                    gameBoard.getGameBoard()[row][i].setValue(messageArray[index]);
                }
                index ++;
            }
        }
    }

    const renderScore = function(playerScore, compterScore){
        renderMessage(['', '', '', playerScore, '-', compterScore,'','',''], true)
    }

    return { renderMessage, renderScore }

})();


const gameLoop = (function(){

    const MAX_NUMBER_OF_TURNS = gameBoard.getAllTiles().length;
    const ANIMATION_DURATION_IN_MS = 500;
    const COMPUTER_MOVE_DELAY_IN_MS = 500;
    let numberOfTurns = 0;
    let whoseTurn = 1;
    let player = {};
    let computer = {};

    const getAnimationDurationInMs = () => ANIMATION_DURATION_IN_MS;

    const initializeGame = function() {
        player = createPlayer('cross');
        computer = createComputer('circle');

        // 1 = player's turn, 0 = computer's turn.
        whoseTurn = 1;
        lastToBegin = 1;

        //Show welcome message, and after a delay, start the game.
        //lock tiles to make them non clickable
        let delay = 1000;
        gameBoard.lockTiles();
        displayController.renderMessage(['T','I','C','T','A','C','T','O','E']);
        setTimeout(gameBoard.resetBoardWithWaveAnimation, delay)
        setTimeout(gameBoard.unlockTiles, delay + COMPUTER_MOVE_DELAY_IN_MS);
        setTimeout(nextTurn, delay + ANIMATION_DURATION_IN_MS);
    }

    const newGame = function(shouldDisplayScore){
        let delay = 0;
        shouldDisplayScore ? delay = 3000 : delay = 1900; 

        if(shouldDisplayScore){
            setTimeout(()=>{
                soundController.flip();
                displayController.renderScore(player.getScore(),computer.getScore());
            }, 1000);
        }

         //Reset game board
         setTimeout(gameBoard.resetBoard, delay - 500);

        numberOfTurns = 0;
        
        switchBeginningTurns();

        setTimeout(nextTurn, delay);
    }

    const nextTurn = function() {
        //check for wins
        if(gameBoard.validateMove()) {
            setTimeout(()=>{
                win(gameBoard.validateMove());
            }, 500);
            return;
        }
        //check for ties
        if(numberOfTurns === MAX_NUMBER_OF_TURNS) {
            setTimeout(tie, 1000);
            return;
        }

        numberOfTurns ++;
        switchTurns();
    }

    const win = function() {

        soundController.flip();

        gameBoard.lockTiles();

        whoseTurn ? computer.increaseScore() : player.increaseScore();

        //lock winning tiles for editing (note, this is different from lockTiles(), which locks tiles from being clickable)
        gameBoard.getWinningTiles().forEach((e)=>{
            e.getTile().classList.add('locked');
        });
        //hide the losing tiles and then unlock all
        gameBoard.getGameBoard().forEach((row)=>{
            row.forEach((e)=>{
                if(!e.getTile().classList.contains('locked') && e.getToken() !==''){
                    e.setToken('');
                }
                e.getTile().classList.remove('locked');
            })
        })

        setTimeout(()=>{
            newGame(true);
        }, 500)

    }

    const tie = function(){
        soundController.flip();
        displayController.renderMessage(['','','','T','I','E','','',''], true);
        newGame(false);
    }

    const makeComputerMove = function() {
        setTimeout(computer.calculateMove, COMPUTER_MOVE_DELAY_IN_MS);     
    }

    const switchBeginningTurns = () => {
        if(lastToBegin) {
            whoseTurn = 0;
            lastToBegin = 0;
        } else {
            whoseTurn = 1;
            lastToBegin = 1;
        }
    }

    const switchTurns = () => {
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

    //Drop shadow element 
    const shadow = document.createElement('div');
    shadow.classList.add('shadow');
    container.appendChild(shadow);

    let token = '';

    const getToken = () => token;
    const setToken = function(newToken) {
        flip();
        token = newToken;
        //updates the tile token when the tiles are mid animation, ie. when the text is not visible.
        setTimeout(()=>{
            if(token === '') removeToken();
            else tile.classList.add(token);
        }, gameLoop.getAnimationDurationInMs() / 1.9)
    } 

    const removeToken = function(){
        tile.classList.remove('circle');
        tile.classList.remove('cross');
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
        //updates the tile text when the tiles are mid animation, ie. when the text is not visible.
        setTimeout(()=>{
            tile.textContent = value;
        }, gameLoop.getAnimationDurationInMs() / 2 );
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
            gameBoard.lockTiles();
        }
    });    

    return { getTile, getRow, getColumn, getValue, setValue, getContainer, setValueWithFlip, setToken, getToken }
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

    
    let tokensFound = 0; //used for scanning after 2 or more tokens in a row
    let firstToken = '';
    let winningStreakFound = false;
    let streak = []; // a streak refers to either a row, a column or a diagonal.
    let currentStreakSearch = [];

    const calculateMove = function(){

        const gameBoardArray = gameBoard.getGameBoard();

         // 1) Always aim for the center in the beginning.
        if(tryMoveCenter(gameBoardArray)) return;

        // 2) If center is taken and surrounding squares are empty, make a random move.
        if(surroundingSquaresEmpty()) {
            makeRandomMove(gameBoardArray);
            return;
        }

        // 3) Check for row, column or diagonal with 2 of same kind and with an empty slot.
        // Every now and then, make a random move instead.
        if (getRandomInt(6) > 5) {
            makeRandomMove(gameBoardArray);
            return;
        }

        checkStreaks(gameBoardArray); //updates 'streak' if appropriate streak is found
        if(streak.length > 0) {
            makeMoveInEmptySpot(streak);
            return;
        }

        // 4) If all else fails, make random move.
        makeRandomMove(gameBoardArray);
    }

    const containtsEmptySlot = (streak) => {
        let hasEmptySlot = false;
        streak.forEach((tile) => {
            if(tile.getToken() === '') hasEmptySlot = true;
        })
        return hasEmptySlot;
    }

    const makeMoveInEmptySpot = (streak) => {
       
        streak.forEach((tile) => {
    
            if(tile.getToken() === '') {
                gameBoard.makeMove(tile.getRow(), tile.getColumn());
                gameLoop.nextTurn();
            }
        })
    }

    const search = function (tile){
        let isEnemyToken = false;

        if(tile.getToken() !== '') { 
            tokensFound ++;
            // Set first token, if not already set
            if(firstToken === '') firstToken = tile.getToken();
        }
        if(tokensFound === 2 && firstToken === tile.getToken()) {
            
            if(firstToken !== token) isEnemyToken = true;

            if(!isEnemyToken) { 
                streak = currentStreakSearch;
                winningStreakFound = true;
            }

            // Only set enemy streak if there is no streak with own token
            if(isEnemyToken && streak.length === 0) {
                streak = currentStreakSearch;
            }
        }
    }


    const checkStreaks = (board) => {

        scanRows(board, search);

        if(!winningStreakFound) scanColumns(board, search);

        if(!winningStreakFound) scanDiagonals(board, search);

        return streak;
    }

    const scanRows = (board, func) => {
        streak = [];
        tokensFound = 0;
        firstToken = '';

        for(let row = 0; row < 3; row ++){
            
            currentStreakSearch = board[row];

            if (!containtsEmptySlot(currentStreakSearch)) continue;

            board[row].forEach((tile) => { func(tile) })
            tokensFound = 0;
            firstToken = '';
        }
    }

    const scanColumns = (board, func) => {
        tokensFound = 0;
        firstToken = '';

        const columns = gameBoard.getColumns();
        
        for(let column = 0; column < 3; column ++){

            currentStreakSearch = columns[column];

            if (!containtsEmptySlot(currentStreakSearch)) {
                continue;}


            columns[column].forEach((tile) => { func(tile) })
            tokensFound = 0;
            firstToken = '';
        }
    }

    const scanDiagonals = (board, func) => {
        tokensFound = 0;
        firstToken = '';

        for(let i = 0; i < 2; i ++){
            currentStreakSearch = [];
            currentStreakSearch = gameBoard.getDiagonals()[i];

            if (!containtsEmptySlot(currentStreakSearch)) continue;

            gameBoard.getDiagonals()[i].forEach((tile) => { func(tile) })
            tokensFound = 0;
            firstToken = '';
        }
    }

    const surroundingSquaresEmpty = () => {
        let squaresEmpty = true;

        gameBoard.getAllTiles().forEach((tile) => {
            if(tile.getRow() === 1 && tile.getColumn() === 1) return;
            if(tile.getToken() !== '') squaresEmpty = false;
        });
        return squaresEmpty;
    }

    const tryMoveCenter = (board) => {
        if(board[1][1].getToken() === '') {
            gameBoard.makeMove(1, 1);
            gameLoop.nextTurn();
            return true;
        }
        return false;
    }

    const makeRandomMove = (board) => {
        const generateNewMove = function(){
            const row = getRandomInt(board.length);
            const column = getRandomInt(board.length);
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

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function allEqual(array){
    return array.every(function(element){
        return element.getToken() === array[0].getToken();
    });
}