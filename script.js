function game(){

    let numberOfTurns = 0;

    const getNumberOfTurns = () => numberOfTurns;

    const increaseNumberOfTurns = () => numberOfTurns ++;

    const newGame = function() {

    }

    const nexTurn = function() {

    }

    const makeComputerMove = function() {

    }

    const win = function() {

    }

    return { getNumberOfTurns, increaseNumberOfTurns, newGame, nexTurn, makeComputerMove, win }
}

function gameBoard(){
    let gameBoard = [[],[],[]];

    const resetBoard = function() {

    }

    const isMoveLegal = function(){

    }

    const addMove = function(token){

    }

    const validateMove = function(){

    }

    const showWinningTiles = function(){

    }

    return { resetBoard, isMoveLegal, addMove, validateMove, showWinningTiles }
}

function player(token){
    let token = token;
    const getToken = () => token;

    return { getToken }
}