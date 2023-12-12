// Constantes globales 
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
  
// Fonction pour gérer le mode humain vs humain 
  function handleHumanVsHuman(row, col) {
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
  
  let backgroundMusic;

function handleHumanVsAI(row, col) {
  // Pour lancer la musique
  backgroundMusic = document.getElementById('humainVSia');
  backgroundMusic.play();

  
  // L'humain joue
  if (isValidMove(row, col, currentBoard, currentPlayer)) {
    makeMove(row, col, currentBoard, currentPlayer);
    updateUI();

    if (checkEndGame(currentBoard)) {
      document.getElementById('game-message').textContent = 'Le jeu est terminé!';     
      getWinner();
      stopBackgroundMusic();
    } else {
      currentPlayer = 'o';

      // L'IA joue après la mise à jour du joueur actuel
        setTimeout(() => {
        makeRandomAIMove();//pour mettre l'adversaire IA en mode MinMax il faut remplacer cette 
        //ligne par celle ci: makeMinimaxAIMove(); 
        updateUI();

        if (checkEndGame(currentBoard)) {
          document.getElementById('game-message').textContent = 'Le jeu est terminé!';      getWinner();
          getWinner();
          stopBackgroundMusic();
            
         
        } else {
          currentPlayer = 'u';
          updateClickableCells();
          highlightCurrentPlayerMoves();

        

          if (!hasValidMoves(currentBoard, currentPlayer)) {
            alert('Le joueur Noir ne peut plus jouer. Le jeu est terminé!');
            getWinner();
            stopBackgroundMusic();
          }
        }
      }, 1200); // Ajout d'un délai avant que l'IA ne joue
    }
  } else {
    alert('Coup invalide. Veuillez réessayer.', '', 'error');
  }
}

let selectedAIMode = 'random';

function handleAIVsAI(selectedAIMode) {
  // Pour lancer la musique
  const backgroundMusic = document.getElementById('iaVSia');
  backgroundMusic.play();

  const delayBetweenMoves = 1000;

  const playNextMove = () => {
    if (selectedAIMode === 'minimax') {
      makeMinimaxAIMove();
    } else {
      makeRandomAIMove();
    }

    updateUI();

    if (checkEndGame(currentBoard)) {
      document.getElementById('game-message').textContent = 'Le jeu est terminé!';    
      getWinner();
      stopBackgroundMusic();
      updateClickableCells();
      highlightCurrentPlayerMoves();
    } else {
      currentPlayer = currentPlayer === 'u' ? 'o' : 'u';
      setTimeout(playNextMove, delayBetweenMoves);
    }
  };

  // Commencez la séquence de mouvements
  playNextMove();
}


function stopBackgroundMusic() {
  if(backgroundMusic){
    backgroundMusic.pause();

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


  
function isValidMove(row, col, currentBoard, currentPlayer) {
    // Vérifie si la position est en dehors des limites du plateau ou si la cellule n'est pas vide ('v')
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || currentBoard[row][col] !== 'v') {
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
        if (currentBoard[r][c] === currentPlayer) {
          if (foundOpponentPiece) {
            return true;
          } else {
            // Si la première pièce rencontrée est du joueur actuel, on arrête la recherche dans cette direction
            break;
          }
        } else if (currentBoard[r][c] === 'v') {
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
  

function makeMove(row, col, currentBoard, currentPlayer) {
  // Liste des directions possibles pour vérifier les pièces adverses dans toutes les directions
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

  // Parcourt chaque direction pour effectuer le mouvement
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponentPiece = false;

    // Parcourt les cases dans la direction spécifiée
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      if (currentBoard[r][c] === currentPlayer) {
        if (foundOpponentPiece) {
          // Retourne les pièces adverses entre le mouvement et une pièce du joueur
          let flipRow = row + dr;
          let flipCol = col + dc;

          while (flipRow !== r || flipCol !== c) {
            currentBoard[flipRow][flipCol] = currentPlayer;
            flipRow += dr;
            flipCol += dc;
          }

          break;
        } else {
          // Si la première pièce rencontrée est du joueur actuel, on arrête la recherche dans cette direction
          break;
        }
      } else if (currentBoard[r][c] === 'v') {
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
  currentBoard[row][col] = currentPlayer;

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

// Effectue un mouvement aléatoire pour l'IA.
function makeRandomAIMove() {
  // Obtient la liste des mouvements disponibles pour le joueur actuel
  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);

  // S'il y a des mouvements disponibles, en choisir un au hasard et le jouer
  if (availableMoves.length > 0) {
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove.row, randomMove.col, currentBoard, currentPlayer);
  }

// Fonction pour faire un mouvement avec l'IA Minimax
function makeMinimaxAIMove() {
  const depth = 4;
  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);

  if (availableMoves.length > 0) {
    const bestMove = getBestMove(currentBoard, currentPlayer, depth);
    makeMove(bestMove.row, bestMove.col, currentBoard, currentPlayer);
  }
}

function getBestMove(currentBoard, currentPlayer, depth) {
  let bestMove = null;
  let bestScore = -Infinity;

  const availableMoves = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  for (const move of availableMoves) {
    const tempBoard = JSON.parse(JSON.stringify(currentBoard));
    makeMove(move.row, move.col, tempBoard, currentPlayer);
    const score = minimax(tempBoard, depth, false);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

}





// Fonction principale de l'algorithme minimax
function minimax(currentBoard, depth, maximizingPlayer) {
  if (depth === 0 || checkEndGame(currentBoard)) {
    const evaluation = evaluate(currentBoard, currentPlayer);
    console.log(`Profondeur: ${depth}, Evaluation: ${evaluation}`);
    return { score: evaluation, move: null };
  }

  // Détermine le joueur actuel et son adversaire en fonction du mode de maximisation
  const player = maximizingPlayer ? 'o' : 'u';
  const opponent = maximizingPlayer ? 'u' : 'o';

  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);

  let bestMove = availableMoves[0]; 
  let bestScore = maximizingPlayer ? -Infinity : Infinity;

  // Parcourt tous les mouvements possibles
  for (const move of availableMoves) {
    console.log(`Checking move at (${move.row}, ${move.col})`);
    // Copie le plateau pour simuler le mouvement
    const tempBoard = JSON.parse(JSON.stringify(currentBoard));
    // Effectue le mouvement sur la copie du plateau
    if (makeMove(move.row, move.col, tempBoard, maximizingPlayer ? player : opponent)) {
      // Appelle récursivement minimax avec la profondeur réduite
      const score = minimax(tempBoard, depth - 1, !maximizingPlayer).score;

      console.log(`Move at (${move.row}, ${move.col}), Score: ${score}`);

      // Met à jour la meilleure évaluation avec le maximum ou le minimum des évaluations obtenues
      if ((maximizingPlayer && score > bestScore) || (!maximizingPlayer && score < bestScore)) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  console.log(`Best move: ${bestMove ? `(${bestMove.row}, ${bestMove.col})` : 'null'}, Best score: ${bestScore}`);
  return { score: bestScore, move: bestMove };
}



function evaluate(currentBoard, currentPlayer) {
    

// Pour avoir la version de la fonction evaluate qui prends en compte la stratégie postionnelle. 
const player = currentPlayer;
const opponent = currentPlayer === 'o' ? 'u' : 'o';


// Scores pour la stratégie positionnelle
const cornerScore = 10;  // Score attribué aux coins
const adjacentScore = 5; // Score attribué aux positions adjacentes aux coins

// Calcul du score total
let totalScore = 0;

// Parcourez les coins du plateau
const corners = [{ row: 0, col: 0 }, { row: 0, col: boardSize - 1 }, { row: boardSize - 1, col: 0 }, { row: boardSize - 1, col: boardSize - 1 }];
for (const corner of corners) {
  if (currentBoard[corner.row][corner.col] === player) {
    totalScore += cornerScore;
  } else if (currentBoard[corner.row][corner.col] === opponent) {
    totalScore -= cornerScore;
  }
}

// Parcourez les positions adjacentes aux coins
const adjacentPositions = [
  { row: 1, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 },
  { row: 1, col: boardSize - 1 }, { row: 0, col: boardSize - 2 }, { row: 1, col: boardSize - 2 },
  { row: boardSize - 2, col: 0 }, { row: boardSize - 1, col: 1 }, { row: boardSize - 2, col: 1 },
  { row: boardSize - 2, col: boardSize - 1 }, { row: boardSize - 1, col: boardSize - 2 }, { row: boardSize - 2, col: boardSize - 2 },
];

for (const position of adjacentPositions) {
  if (currentBoard[position.row][position.col] === player) {
    totalScore += adjacentScore;
  } else if (currentBoard[position.row][position.col] === opponent) {
    totalScore -= adjacentScore;
  }
}

return totalScore


}














  



function hasValidMoves(currentBoard, currentPlayer) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        return true;
      }
    }
  }
  return false;
}


//  Renvoie la liste des mouvements possibles pour un joueur donné.
function getAvailableMoves(currentBoard, player) {
  const availableMoves = [];

  // Parcourt toutes les cellules du plateau
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // Vérifie si le mouvement est valide pour le joueur actuel
      if (isValidMove(i, j, currentBoard, player)) {
        // Ajoute le mouvement à la liste des mouvements possibles
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  // Renvoie la liste complète des mouvements possibles
  return availableMoves;
}


  function evaluate(currentBoard,currentPlayer) { 
    // Version qui prends en compte la stratégie de mobilité. 
  const player = currentPlayer;
  const opponent = currentPlayer === 'o' ? 'u' : 'o';

  // Score pour la mobilité
  const mobilityScore = 1;  // Score attribué pour chaque coup possible

  // Évaluez la mobilité pour chaque joueur
  const playerMobility = getAvailableMoves(currentBoard, player).length;
  const opponentMobility = getAvailableMoves(currentBoard, opponent).length;

  // Retournez la différence de mobilité (score de mobilité)
  return (playerMobility - opponentMobility) * mobilityScore;

  
  // Pour avoir la version de la fonction evaluate qui prends en compte la stratégie postionnelle. 
  // const player = currentPlayer;
  // const opponent = currentPlayer === 'o' ? 'u' : 'o';


  // // Scores pour la stratégie positionnelle
  // const cornerScore = 10;  // Score attribué aux coins
  // const adjacentScore = 5; // Score attribué aux positions adjacentes aux coins

  // // Calcul du score total
  // let totalScore = 0;

  // // Parcourez les coins du plateau
  // const corners = [{ row: 0, col: 0 }, { row: 0, col: boardSize - 1 }, { row: boardSize - 1, col: 0 }, { row: boardSize - 1, col: boardSize - 1 }];
  // for (const corner of corners) {
  //   if (currentBoard[corner.row][corner.col] === player) {
  //     totalScore += cornerScore;
  //   } else if (currentBoard[corner.row][corner.col] === opponent) {
  //     totalScore -= cornerScore;
  //   }
  // }

  // // Parcourez les positions adjacentes aux coins
  // const adjacentPositions = [
  //   { row: 1, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 },
  //   { row: 1, col: boardSize - 1 }, { row: 0, col: boardSize - 2 }, { row: 1, col: boardSize - 2 },
  //   { row: boardSize - 2, col: 0 }, { row: boardSize - 1, col: 1 }, { row: boardSize - 2, col: 1 },
  //   { row: boardSize - 2, col: boardSize - 1 }, { row: boardSize - 1, col: boardSize - 2 }, { row: boardSize - 2, col: boardSize - 2 },
  // ];

  // for (const position of adjacentPositions) {
  //   if (currentBoard[position.row][position.col] === player) {
  //     totalScore += adjacentScore;
  //   } else if (currentBoard[position.row][position.col] === opponent) {
  //     totalScore -= adjacentScore;
  //   }
  // }

  // return totalScore;
}

function getAvailableMoves(currentBoard, currentPlayer) {
  const availableMoves = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  return availableMoves;
}

function hasValidMoves(currentBoard, currentPlayer) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        return true;
      }
    }
  }
  return false;
} 




function checkEndGame(currentBoard){ 
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, 'u') || isValidMove(i, j, currentBoard, 'o')) {
        return false;
      }
    }
  }
  getWinner();
  return true;

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
