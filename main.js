"use strict";


function createGameBoard() {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.id = `cell-${row}-${column}`; // Attribution de l'identifiant unique
            
         
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece';

        // Classes pour les pièces de départ
        if ((row === 3 && column === 3 ) || (row === 4 && column === 4)){
            pieceElement.classList.add('white');
        }
        else if ((row === 3 && column === 4 ) || (row === 4 && column === 3)){
            pieceElement.classList.add('black');
           
           
        }
           
           
           
            cellElement.appendChild(pieceElement);
            gameBoard.appendChild(cellElement);
        }
    }

    return gameBoard;
}



// Utilisation de la fonction pour créer le plateau de jeu.
const gameBoardElement = createGameBoard();
document.getElementById('game-board').appendChild(gameBoardElement);



