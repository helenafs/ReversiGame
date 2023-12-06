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
  highlightCurrentPlayerMoves(); 
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

  function updateUI() {
    updateBoardVisual();
    updateStatus();
    updateClickableCells();
    highlightCurrentPlayerMoves();
  }

  // Fonction qui gère le clic sur une cellule du plateau de jeu.
  function handleCellClick(row, col) {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => cell.classList.remove('highlight'));
  
    if (document.querySelector('input[name="player"]:checked').value === 'humain-humain') {
      // Mode Humain vs Humain
      handleHumanVsHuman(row, col);
    } else if (document.querySelector('input[name="player"]:checked').value === 'humain-ia') {
      // Mode Humain vs IA
      handleHumanVsAI(row, col);
    } else if (document.querySelector('input[name="player"]:checked').value === 'ia-ia') {
      // Mode IA vs IA
      handleAIVsAI();
    }
    updateUI();
  }

  function handleHumanVsHuman(row, col) {
    // Votre logique actuelle pour le mode Humain vs Humain
    if (isValidMove(row, col, currentBoard, currentPlayer)) {
      makeMove(row, col, currentBoard, currentPlayer);
      updateBoardVisual();
      updateStatus();
  
      if (checkEndGame(currentBoard)) {
        alert('Le jeu est terminé!');
      } else {
        currentPlayer = currentPlayer === 'u' ? 'o' : 'u';
        updateClickableCells();
        highlightCurrentPlayerMoves();
      }
    } else {
      alert('Coup invalide. Veuillez réessayer.', '', 'error');
    }
  }
  
  function handleHumanVsAI(row, col) {
    // L'humain joue
    if (isValidMove(row, col, currentBoard, currentPlayer)) {
      makeMove(row, col, currentBoard, currentPlayer);
      updateUI();
  
      if (checkEndGame(currentBoard)) {
        alert('Le jeu est terminé!', '', 'info');
        getWinner();
      } else {
        // Changer de joueur avant que l'IA ne joue
        currentPlayer = 'o';
        // L'IA joue
        makeAIMove();
      }
    } else {
      alert('Coup invalide. Veuillez réessayer.', '', 'error');
    }
  }

  function updateClickableCells() {
    const allCells = document.querySelectorAll('td');
    allCells.forEach(cell => cell.classList.remove('highlight'));
  
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = document.querySelector(`#board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
        if (isValidMove(i, j, currentBoard, currentPlayer)) {
          cell.classList.add('highlight');
        }
      }
    }
  }
  
  function highlightCurrentPlayerMoves() {
    console.log(`Mise en évidence des mouvements pour le joueur ${currentPlayer}`);
    const currentPlayerMoves = [];
  
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (isValidMove(i, j, currentBoard, currentPlayer)) {
          currentPlayerMoves.push({ row: i, col: j });
        }
      }
    }
  
    console.log(`${currentPlayerMoves.length}  mouvements en surbrillance.`);
  
    const boardElement = document.getElementById('board');
    
    currentPlayerMoves.forEach(move => {
      const cell = boardElement.rows[move.row].cells[move.col];
      
      const circleDiv = document.createElement('div');
      circleDiv.className = 'circle';
  
      
      cell.appendChild(circleDiv);
    });
  }


  
function isValidMove(row, col, board, player) {
    // Vérifie si la position est en dehors des limites du plateau ou si la cellule n'est pas vide ('v')
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || board[row][col] !== 'v') {
      return false;
    }
  
    // Liste des directions possibles pour vérifier les pièces adverses dans toutes les directions
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  
    // Parcourt chaque direction pour vérifier la validité du mouvement
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let foundOpponentPiece = false;
  
      // Parcourt les cases dans la direction spécifiée
      while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        // Si une pièce du joueur est trouvée après une pièce adverse, le mouvement est valide
        if (board[r][c] === player) {
          if (foundOpponentPiece) {
            return true;
          } else {
            // Si la première pièce rencontrée est du joueur actuel, on arrête la recherche dans cette direction
            break;
          }
        } else if (board[r][c] === 'v') {
          // Si une case vide est rencontrée, le mouvement n'est pas valide dans cette direction
          break;
        } else {
          // Si une pièce adverse est trouvée, on marque qu'une pièce adverse a été trouvée
          foundOpponentPiece = true;
        }
  
        // Déplace la position dans la direction spécifiée
        r += dr;
        c += dc;
      }
    }
  
    // Si aucune direction n'a rendu le mouvement valide, retourne false
    return false;
  }
  

function makeMove(row, col, board, player) {
  // Liste des directions possibles pour vérifier les pièces adverses dans toutes les directions
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

  // Parcourt chaque direction pour effectuer le mouvement
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponentPiece = false;

    // Parcourt les cases dans la direction spécifiée
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      if (board[r][c] === player) {
        if (foundOpponentPiece) {
          // Retourne les pièces adverses entre le mouvement et une pièce du joueur
          let flipRow = row + dr;
          let flipCol = col + dc;

          while (flipRow !== r || flipCol !== c) {
            board[flipRow][flipCol] = player;
            flipRow += dr;
            flipCol += dc;
          }

          break;
        } else {
          // Si la première pièce rencontrée est du joueur actuel, on arrête la recherche dans cette direction
          break;
        }
      } else if (board[r][c] === 'v') {
        // Si une case vide est rencontrée, le mouvement n'est pas valide dans cette direction
        break;
      } else {
        // Si une pièce adverse est trouvée, on marque qu'une pièce adverse a été trouvée
        foundOpponentPiece = true;
      }

      // Déplace la position dans la direction spécifiée
      r += dr;
      c += dc;
    }
  }

  // Place la pièce du joueur sur la case du mouvement
  board[row][col] = player;

  // Met à jour les scores après le mouvement
  updateScore();
}

  function updateScore(){
    let countBlack = 0;
    let countWhite = 0;

    // Parcourt le plateau pour compter les pièces de chaque joueur
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (currentBoard[i][j] === 'u') {
        countBlack++;
      } else if (currentBoard[i][j] === 'o') {
        countWhite++;
      }
    }
  }

  // Met à jour les scores globaux
  scoreBlack = countBlack;
  scoreWhite = countWhite;

  }

  function checkEndGame(board){ 
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (isValidMove(i, j, board, 'u') || isValidMove(i, j, board, 'o')) {
          return false;
        }
      }
    }
    getWinner();
    return true;

  }




  // Effectue le mouvement de l'IA en choisissant le meilleur mouvement possible
function makeAIMove() {
  
  
}
  
  function getBestMove(board, player) { //TO DO 
    
  }
  
  function minimax(board, depth, maximizingPlayer) { // TO DO 
    
  }
  


  function evaluate(board) { 
    let score = 0;

    // Parcourt toutes les cellules du plateau
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        // Incrémente le score pour chaque pièce 'o' (Blanc)
        // Décrémente le score pour chaque pièce 'u' (Noir)
        if (board[i][j] === 'o') {
          score++;
        } else if (board[i][j] === 'u') {
          score--;
        }
      }
  }
} 



function getWinner() {
  if(checkEndGame()){
  if (scoreBlack > scoreWhite) {
    alert('Le joueur Noir a gagné!', '', 'success');
  } else if (scoreWhite > scoreBlack) {
    alert('Le joueru Blanc a gagné!', '', 'success');
  } else {
    alert('Match nul!', '', 'info');
  }
}
}















  // Initialiser le plateau au chargement de la page
window.onload = initializeBoard;
