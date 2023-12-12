
const boardSize = 8;
let currentBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill('v'));
let currentPlayer = 'u'; // 'u' pour Noir, 'o' pour Blanc
let scoreBlack = 0;
let scoreWhite = 0;

const CellColors = {
  pair: 'green',        // Couleur pour les cases paires.
  impair: 'darkgreen',  // Couleur pour les cases impaires.
};


function initializeBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('td');
      
      
      cell.addEventListener('click', () => handleCellClick(i, j));

      const color = (i + j) % 2 === 0 ? CellColors.pair : CellColors.impair;
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

  updateBoardVisual();
  highlightCurrentPlayerMoves(); 
  updateStatus();
}



function updateBoardVisual() {
  const boardElement = document.getElementById('board');
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = boardElement.rows[i].cells[j];
      cell.innerHTML = '';

      if (currentBoard[i][j] === 'u') {
        const piece = document.createElement('div');
        piece.className = 'piece black';
        cell.appendChild(piece);
      } else if (currentBoard[i][j] === 'o') {
        const piece = document.createElement('div');
        piece.className = 'piece white';
        cell.appendChild(piece);
      }
    }
  }
}

function updateStatus() {
  const currentPlayerSpan = document.getElementById('current-player');
  currentPlayerSpan.textContent = currentPlayer === 'u' ? 'Noir' : 'Blanc';

  const scoreBlackSpan = document.getElementById('score-black');
  scoreBlackSpan.textContent = scoreBlack;

  const scoreWhiteSpan = document.getElementById('score-white');
  scoreWhiteSpan.textContent = scoreWhite;
}

function updateUI() {
  updateBoardVisual();
  updateStatus();
  updateClickableCells();
  highlightCurrentPlayerMoves();
}

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

function displayGameMessage(message) {
  document.getElementById('game-message').textContent = message;
}

function handleHumanVsHuman(row, col) {
  if (isValidMove(row, col, currentBoard, currentPlayer)) {
    makeMove(row, col, currentBoard, currentPlayer);
    updateBoardVisual();
    updateStatus();

    if (checkEndGame(currentBoard)) {
      document.getElementById('game-message').textContent = 'Le jeu est terminé!';      getWinner(); 
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
      stopBackgroundMusic();
    } else {
      currentPlayer = 'o';

      // L'IA joue après la mise à jour du joueur actuel
        setTimeout(() => {
        makeRandomAIMove();
        updateUI();

        if (checkEndGame(currentBoard)) {
          document.getElementById('game-message').textContent = 'Le jeu est terminé!';      
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
  // console.log(`Highlighting moves for player ${currentPlayer}`);
  const currentPlayerMoves = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        currentPlayerMoves.push({ row: i, col: j });
      }
    }
  }

  // console.log(`${currentPlayerMoves.length} moves highlighted.`);

  const boardElement = document.getElementById('board');

  // Supprimer tous les cercles existants avant d'ajouter les nouveaux
  const existingCircles = document.querySelectorAll('.circle');
  existingCircles.forEach(circle => circle.remove());

  currentPlayerMoves.forEach(move => {
    const cell = boardElement.rows[move.row].cells[move.col];

    const circleDiv = document.createElement('div');
    circleDiv.className = 'circle';

    cell.appendChild(circleDiv);
  });
}


function isValidMove(row, col, currentBoard, currentPlayer) {
  if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || currentBoard[row][col] !== 'v') {
    return false;
  }

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponentPiece = false;

    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      if (currentBoard[r][c] === currentPlayer) {
        if (foundOpponentPiece) {
          return true;
        } else {
          break;
        }
      } else if (currentBoard[r][c] === 'v') {
        break;
      } else {
        foundOpponentPiece = true;
      }

      r += dr;
      c += dc;
    }
  }

  return false;
}

function makeMove(row, col, currentBoard, currentPlayer) {
  console.log(`Making move at (${row}, ${col}) for player ${currentPlayer}`);
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponentPiece = false;

    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      if (currentBoard[r][c] === currentPlayer) {
        if (foundOpponentPiece) {
          let flipRow = row + dr;
          let flipCol = col + dc;

          while (flipRow !== r || flipCol !== c) {
            currentBoard[flipRow][flipCol] = currentPlayer;
            flipRow += dr;
            flipCol += dc;
          }

          break;
        } else {
          break;
        }
      } else if (currentBoard[r][c] === 'v') {
        break;
      } else {
        foundOpponentPiece = true;
      }

      r += dr;
      c += dc;
    }
  }

  currentBoard[row][col] = currentPlayer;
  updateScore();
}


function updateScore() {
  let countBlack = 0;
  let countWhite = 0;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (currentBoard[i][j] === 'u') {
        countBlack++;
      } else if (currentBoard[i][j] === 'o') {
        countWhite++;
      }
    }
  }

  scoreBlack = countBlack;
  scoreWhite = countWhite;
}

// Fonction pour faire un mouvement aléatoire
function makeRandomAIMove() {
  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);

  if (availableMoves.length > 0) {
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove.row, randomMove.col, currentBoard, currentPlayer);
  }
}


// Fonction pour faire un mouvement avec l'IA Minimax
function makeMinimaxAIMove() {
  const depth = 8;
  const alpha = -Infinity; // Initialisez alpha
  const beta = Infinity; // Initialisez beta
  const minimaxResult = minimax(currentBoard, depth, alpha, beta, currentPlayer);
  
  if (minimaxResult.move) {
    const minmaxMove = minimaxResult.move;
    makeMove(minmaxMove.row, minmaxMove.col, currentBoard, currentPlayer);
  } else {
    console.error("Pas de mouvement valide trouvé par l'algorithme Minmax");
  }
}



// Fonction pour faire un mouvement avec l'IA Minimax
function makeMinimaxAIMove() {
  const depth = 4;
  const minimaxResult = minimax(currentBoard, depth,alpha,beta,currentPlayer);
  
  if (minimaxResult.move) {
    const minmaxMove = minimaxResult.move;
    makeMove(minmaxMove.row, minmaxMove.col, currentBoard, currentPlayer);
  } else {
    console.error("Pas de mouvement valide trouvé par l'algorithme Minmax");
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

// // Fonction principale de l'algorithme minimax avec élagage Alpha-Bêta
// function minimax(currentBoard, depth, alpha, beta, maximizingPlayer) {
//   if (depth === 0 || checkEndGame(currentBoard)) {
//     const evaluation = evaluate(currentBoard, currentPlayer);
//     console.log(`Profondeur: ${depth}, Evaluation: ${evaluation}`);
//     return { score: evaluation, move: null };
//   }

//   // Détermine le joueur actuel et son adversaire en fonction du mode de maximisation
//   const player = maximizingPlayer ? 'o' : 'u';
//   const opponent = maximizingPlayer ? 'u' : 'o';

//   const availableMoves = getAvailableMoves(currentBoard, currentPlayer);

//   let bestMove = availableMoves[0];
//   let bestScore = maximizingPlayer ? -Infinity : Infinity;

//   // Parcourt tous les mouvements possibles
//   for (const move of availableMoves) {
//     console.log(`Checking move at (${move.row}, ${move.col})`);
//     // Copie le plateau pour simuler le mouvement
//     const tempBoard = JSON.parse(JSON.stringify(currentBoard));
//     // Effectue le mouvement sur la copie du plateau
//     if (makeMove(move.row, move.col, tempBoard, maximizingPlayer ? player : opponent)) {
//       // Appelle récursivement minimax avec la profondeur réduite et l'élagage Alpha-Bêta
//       const score = minimax(tempBoard, depth - 1, alpha, beta, !maximizingPlayer).score;

//       console.log(`Move at (${move.row}, ${move.col}), Score: ${score}`);

//       // Met à jour la meilleure évaluation avec le maximum ou le minimum des évaluations obtenues
//       if (maximizingPlayer) {
//         if (score > bestScore) {
//           bestScore = score;
//           bestMove = move;
//         }
//         alpha = Math.max(alpha, bestScore);
//       } else {
//         if (score < bestScore) {
//           bestScore = score;
//           bestMove = move;
//         }
//         beta = Math.min(beta, bestScore);
//       }

//       // Effectue l'élagage Alpha-Bêta
//       if (beta <= alpha) {
//         break;
//       }
//     }
//   }

//   console.log(`Best move: ${bestMove ? `(${bestMove.row}, ${bestMove.col})` : 'null'}, Best score: ${bestScore}`);
//   return { score: bestScore, move: bestMove };
// }


function evaluate(currentBoard, currentPlayer) {
    
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



//   Pour avoir la version de la fonction evaluate qui prends en compte la stratégie postionnelle. 
//   const player = currentPlayer;
//   const opponent = currentPlayer === 'o' ? 'u' : 'o';


//   // Scores pour la stratégie positionnelle
//   const cornerScore = 10;  // Score attribué aux coins
//   const adjacentScore = 5; // Score attribué aux positions adjacentes aux coins

//   // Calcul du score total
//   let totalScore = 0;

//   // Parcourez les coins du plateau
//   const corners = [{ row: 0, col: 0 }, { row: 0, col: boardSize - 1 }, { row: boardSize - 1, col: 0 }, { row: boardSize - 1, col: boardSize - 1 }];
//   for (const corner of corners) {
//     if (currentBoard[corner.row][corner.col] === player) {
//       totalScore += cornerScore;
//     } else if (currentBoard[corner.row][corner.col] === opponent) {
//       totalScore -= cornerScore;
//     }
//   }

//   // Parcourez les positions adjacentes aux coins
//   const adjacentPositions = [
//     { row: 1, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 },
//     { row: 1, col: boardSize - 1 }, { row: 0, col: boardSize - 2 }, { row: 1, col: boardSize - 2 },
//     { row: boardSize - 2, col: 0 }, { row: boardSize - 1, col: 1 }, { row: boardSize - 2, col: 1 },
//     { row: boardSize - 2, col: boardSize - 1 }, { row: boardSize - 1, col: boardSize - 2 }, { row: boardSize - 2, col: boardSize - 2 },
//   ];

//   for (const position of adjacentPositions) {
//     if (currentBoard[position.row][position.col] === player) {
//       totalScore += adjacentScore;
//     } else if (currentBoard[position.row][position.col] === opponent) {
//       totalScore -= adjacentScore;
//     }
//   }

//   return totalScore;
// 
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


function checkEndGame(currentBoard) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, 'u') || isValidMove(i, j, currentBoard, 'o')) {
        return false;
      }
    }
  }
  return true;
}

function getWinner() {
  if (scoreBlack > scoreWhite) {
    alert('Le joueur Noir a gagné!', '', 'success');
  } else if (scoreWhite > scoreBlack) {
    alert('Le joueur Blanc a gagné!', '', 'success');
  } else {
    alert('Match nul!', '', 'info');
  }
}

// Pour effectuer les test il faut dé commenter cette partie.
// function runAITests(numGamesToPlay) {
//   const statistics = {
//     numGames: 0,
//     totalWinsBlack: 0,
//     totalWinsWhite: 0,
//     totalTime: 0,
//     movesByPlayer: { u: [], o: [] },
//   };

//   for (let i = 0; i < numGamesToPlay; i++) {
//     initializeBoard();

//     const startTime = performance.now();

//     handleAIVsAI();

//     const endTime = performance.now();
//     const gameDuration = endTime - startTime;
//     statistics.totalTime += gameDuration;

//     // Mesurez le nombre de coups dans chaque partie
//     const movesBlack = getMovesByPlayer('u', i + 1);
//     const movesWhite = getMovesByPlayer('o', i + 1);

//     statistics.movesByPlayer.u.push(movesBlack);
//     statistics.movesByPlayer.o.push(movesWhite);

   

//     statistics.numGames++;

//     if (scoreBlack > scoreWhite) {
//       statistics.totalWinsBlack++;
//     } else if (scoreWhite > scoreBlack) {
//       statistics.totalWinsWhite++;
//     }
//   }


//   console.log('Statistiques des tests :', statistics);
//   console.table(statistics);
//   statistics.totalTime = 0;
// }

// function getMovesByPlayer(currentPlayer, matchNumber) {
//   const moves = [];

//   for (let i = 0; i < boardSize; i++) {
//     for (let j = 0; j < boardSize; j++) {
//       if (currentBoard[i][j] === currentPlayer) {
//         const position = `${String.fromCharCode(97 + j)}${i + 1}`;
//         moves.push(position);
//       }
//     }
//   }

//   console.log(`Match ${matchNumber}: Joueur ${currentPlayer === 'u' ? 'Noir' : 'Blanc'}, liste des mouvements: `, moves);

//   return moves;
// }


window.onload = function () {
  initializeBoard();

  // Fonction pour démarrer le jeu en mode IA vs IA avec le mode sélectionné
  function startAIVsAI() {
    const selectedAIMode = document.getElementById('ai-mode').value;
    initializeBoard();
    handleAIVsAI(selectedAIMode);
  
  //  Pour les test il faut aussi décommenter cette partie, il est possible d'ajuster le nombre de parties que l'on veut tester. 
  //  let numGames;
  //  if (selectedAIMode === 'random') {
  //    numGames = 1000;
  //  } else if (selectedAIMode === 'minimax') {
  //    numGames = 1000;
  //  }

  //  runAITests(numGames);
   }
  

  // Ajouter un gestionnaire d'événements au bouton IA vs IA
  const boutonIA = document.querySelector('input[name="player"][value="ia-ia"]');
  boutonIA.addEventListener('click', startAIVsAI);

  document.getElementById('newGameButton').addEventListener('click', function () {
    // Arrête la musique si elle est en cours de lecture
    stopBackgroundMusic();

    // Réinitialise les variables du jeu
    currentBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill('v'));
    currentPlayer = 'u';
    scoreBlack = 0;
    scoreWhite = 0;

    // Réinitialise l'interface graphique
    initializeBoard();

    // Vérifie le mode de jeu et lance la partie correspondante
    const selectedMode = document.querySelector('input[name="player"]:checked').value;
    if (selectedMode === 'ia-ia') {
      // Utilisez la fonction dédiée pour démarrer le jeu en mode IA vs IA
      startAIVsAI();
    } else {
      // Ajoutez des conditions pour les autres modes si nécessaire
      updateUI(); // Ajoutez cette ligne pour mettre à jour l'interface utilisateur après la réinitialisation du plateau
    }
  });

  // Ajout de cette ligne pour démarrer automatiquement le jeu IA vs IA au chargement de la page
  if (boutonIA.checked) {
    startAIVsAI();
  }
};

