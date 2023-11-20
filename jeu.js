"use strict";


//classe pour counstruire la grille 
class ReversiGrille {

// Constantes pour la grille.
static gridSize = 8;
static colors = {white: 'white', black: 'black'};

// Nous initialisons l'élément du plateau de jeu dans le constructeur.
// Cela crée le plateau de jeu et stocke l'élément dans this.gameBoardElement.
constructor() {
    this.gameBoardElement = this.createGameBoard();
}

// Cette méthode crée et retourne l'élément du plateau de jeu.
createGameBoard() {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';

    for (let row = 0; row < ReversiGrille.gridSize; row++) {
        for (let column = 0; column < ReversiGrille.gridSize; column++) {
            // Crée un élément de cellule pour chaque case de la grille.
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.id = `cell-${row}-${column}`; // Attribution de l'identifiant unique
            
            // Crée un élément pour représenter une pièce dans la cellule.
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

/* Cette fonction affiche le plateau de jeu dans la page HTML en l'ajoutant à un élément conteneur existant.
  Si l'élément conteneur n'existe pas, un message d'erreur est affiché dans la console. */

  displayGameBoard() {

    const gameBoardContainer = document.getElementById('game-board');
    if (gameBoardContainer) {
      // On ajoute le plateau de jeu à l'élément avec l'ID "game-board" dans la page HTML.
      gameBoardContainer.appendChild(this.gameBoardElement);
           
    }
    else {
      console.error("Il n'y a pas d'élément pour contenir le plateau de jeu.")
    }
    
    }

}
// pour tester si la fonction displayGameBoard fonctionne bien.
// La suite étant que cette étape se fera ailleurs automatiquement dans l'initialisation du jeu.
const reversiGrid = new ReversiGrille();
reversiGrid.displayGameBoard();


//classe pour le jeu 
class Reversi{

    constructor(){

    }

   getMove(){
    //var clickedPiece = this.pieces[i][j];
    //var clickedLocation = [i, j];

    //console.log("Location Clicked: " + i + ", "+ j);
   }

}

 
//classe pour le jeu 
class Reversi{

    constructor(){

    }

   getMove(){
    //var clickedPiece = this.pieces[i][j];
    //var clickedLocation = [i, j];

    //console.log("Location Clicked: " + i + ", "+ j);
   }

}

//classe pour les pieces 

class Pieces{

    constructor(type,local){

    }

    creerPiece(){
        if(this.local!=null){
            this.piece.style.backgroundColor  = this.color;
        }
    }

    flipPiece(){
    //le blanc devient noir et vice-versa
        if (this.type == PieceEnum.white){
            this.color = PieceColors[PieceEnum.black];
            //this.otherColor = PieceColors[PieceEnum.white];
            this.type = PieceEnum.black;
        } else {
            this.color = PieceColors[PieceEnum.white];
            //this.otherColor = PieceColors[PieceEnum.black];
            this.type = PieceEnum.white;
        }

        this.creerPiece; 

    }

}