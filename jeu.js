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

function updateStatus() {
    // Obtient l'élément span pour le joueur actuel
    const currentPlayerSpan = document.getElementById('current-player');
    
    // Met à jour le texte du joueur actuel en fonction de la valeur de currentPlayer ('u' ou 'o')
    currentPlayerSpan.textContent = currentPlayer === 'u' ? 'Noir' : 'Blanc';
  
    // Obtient les éléments span pour les scores des joueurs noir et blanc
    const scoreBlackSpan = document.getElementById('score-black');
    const scoreWhiteSpan = document.getElementById('score-white');
    
    // Met à jour les textes des scores avec les valeurs actuelles de scoreBlack et scoreWhite
    scoreBlackSpan.textContent = scoreBlack;
    scoreWhiteSpan.textContent = scoreWhite;
  }

  // Fonction qui gère le clic sur une cellule du plateau de jeu.
  function handleCellClick(row, col) {
    // Vérifie si le mouvement est valide pour le joueur actuel
    if (isValidMove(row, col, currentBoard, currentPlayer)) {
      // Effectue le mouvement
      makeMove(row, col, currentBoard, currentPlayer);
      
      // Met à jour la visualisation du plateau et les informations de statut
      updateBoardVisual();
      updateStatus();
  
      // Vérifie si le jeu est terminé
      if (checkEndGame(currentBoard)) {
        alert('Le jeu est terminé!');
      } else {
        // Passe au tour suivant en inversant le joueur actuel
        currentPlayer = currentPlayer === 'u' ? 'o' : 'u';
      }
    } else {
      // Alerte si le mouvement n'est pas valide
      alert('Coup invalide. Veuillez réessayer.');
    }
  }
  


























  // Initialiser le plateau au chargement de la page
window.onload = initializeBoard;
