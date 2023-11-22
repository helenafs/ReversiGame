// Taille du plateau
const boardSize = 8;

let currentBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill('v'));

let currentPlayer = 'u'; // 'u' pour Noir, 'o' pour Blanc

// Score des joueurs 
let scoreBlack = 0;
let scoreWhite = 0;

const CellColors = {
    pair: 'green',        // Couleur pour les cases paires.
    impair: 'darkgreen',  // Couleur pour les cases impaires.
  };
  
// Fonction pour initialiser le plateau de jeu 
function initializeBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  
  // Création des cellules du tableau 
  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('td');
      cell.addEventListener('click', () => handleCellClick(i, j));

      // En fonction de sa position une couleur est associé à une case.
      const color = (i + j) % 2 === 0 ? CellColors.pair : CellColors.impair; // Vert clair ou Vert foncé
      cell.style.backgroundColor = color;

      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }

  // Placez les pièces initiales au centre du plateau
  currentBoard[3][3] = 'o';
  currentBoard[3][4] = 'u';
  currentBoard[4][3] = 'u';
  currentBoard[4][4] = 'o';
  

  // Mise à jour du tableau et du statut. 
  updateBoardVisual();
  updateStatus();
}

// Fonction pour mettre à jour l'affichage du tableau 
function updateBoardVisual() {
  const boardElement = document.getElementById('board');

  // On va parcourir le plateau 
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = boardElement.rows[i].cells[j];
      cell.innerHTML = '';
      
      // On va créer un élément div pour représenter une pièce blanche 
      if (currentBoard[i][j] === 'u') {
        const piece = document.createElement('div');
        piece.className = 'piece black';
        cell.appendChild(piece);
      } 
      // On va créer un élément div pour représenter une pièce noire 
      else if (currentBoard[i][j] === 'o') {
        const piece = document.createElement('div');
        piece.className = 'piece white';
        cell.appendChild(piece);
      }
    }
  }
}