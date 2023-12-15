
const boardSize = 8; //taille du plateau 8 x 8
let currentBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill('v'));
let currentPlayer = 'u'; // 'u' pour Noir, 'o' pour Blanc
let scoreBlack = 0; //score initial 
let scoreWhite = 0; //score initial 

const CellColors = {
  pair: 'green',        // Couleur pour les cases paires.
  impair: 'darkgreen',  // Couleur pour les cases impaires.
};

//initialiser le tableau du jeu
function initializeBoard() {
  const boardElement = document.getElementById('board'); //appel a la table "board dans l'html"
  boardElement.innerHTML = '';

  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('tr'); //créer les lignes
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('td'); //créer les cellules 
      
      
      cell.addEventListener('click', () => handleCellClick(i, j)); //"écouter" d'evénements à chaque cellule

      const color = (i + j) % 2 === 0 ? CellColors.pair : CellColors.impair;
      cell.style.backgroundColor = color; //alternance de couleurs en fonction de position

     

      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }

  // Placez les pièces initiales au centre du plateau
  currentBoard[3][3] = 'o';
  currentBoard[3][4] = 'u';
  currentBoard[4][3] = 'u';
  currentBoard[4][4] = 'o';

  // mise à jour du tableau et du statut 
  updateBoardVisual();
  highlightCurrentPlayerMoves(); 
  updateStatus();
}


// mise a jour de l'affichage du tableau
function updateBoardVisual() {
  const boardElement = document.getElementById('board');
  for (let i = 0; i < boardSize; i++) {//parcourir le tableau
    for (let j = 0; j < boardSize; j++) {
      const cell = boardElement.rows[i].cells[j];
      cell.innerHTML = '';


      if (currentBoard[i][j] === 'u') { //creer une div pour les pièces noires
        const piece = document.createElement('div');
        piece.className = 'piece black';
        cell.appendChild(piece);
      } else if (currentBoard[i][j] === 'o') { //creer une div pour les pièces blanches
        const piece = document.createElement('div');
        piece.className = 'piece white';
        cell.appendChild(piece);
      }
    }
  }
}
//mise a jour du joueur en question et son score
function updateStatus() {
  const currentPlayerSpan = document.getElementById('current-player'); //obtient l'span pour le joeur actuel
  currentPlayerSpan.textContent = currentPlayer === 'u' ? 'Noir' : 'Blanc'; //met à jour le texte du joueur actuel en fonction de currentPlayer

  const scoreBlackSpan = document.getElementById('score-black');//span du joueur noir
  scoreBlackSpan.textContent = scoreBlack; //mise à jour de son score 

  const scoreWhiteSpan = document.getElementById('score-white');//span du joueur blanc
  scoreWhiteSpan.textContent = scoreWhite;//mise  à jour de son score
}
//update l'interface utilisateur 
function updateUI() {
  updateBoardVisual();
  updateStatus();
  updateClickableCells();
  highlightCurrentPlayerMoves();
}
//appelee quand un user clique sur une cellule du plateau de jeu
function handleCellClick(row, col) {
  const highlightedCells = document.querySelectorAll('.highlight');
  highlightedCells.forEach(cell => cell.classList.remove('highlight'));
//verifie le mode du jeu
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
//gérer le mode humain vs humain
function handleHumanVsHuman(row, col) {
  if (isValidMove(row, col, currentBoard, currentPlayer)) {//verifie si le coup est valide
    makeMove(row, col, currentBoard, currentPlayer);
    updateBoardVisual();//update le tableau
    updateStatus();//update l'status du jeu

    if (checkEndGame(currentBoard)) {
      document.getElementById('game-message').textContent = 'Le jeu est terminé!';      getWinner(); 
    } else {//si le jeu n'est pas terminé le tour change de joueur
      currentPlayer = currentPlayer === 'u' ? 'o' : 'u';
      updateClickableCells();//met à jour les cellules cliquables pour le prochain joueur
      highlightCurrentPlayerMoves();
    }
  } else {
    alert('Coup invalide. Veuillez réessayer.', '', 'error');
  }
}
//définir la musique de fond
let backgroundMusic;
//gérer le mode humain vs IA 
function handleHumanVsAI(row, col) {
  // Pour lancer la musique
  // backgroundMusic = document.getElementById('humainVSia');
  // backgroundMusic.play();

  
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
        makeRandomAIMove();//IA joue avec un mouvement aleatoire 
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
//variable qu'stocke le mode IA sélectionné pour jouer
let selectedAIMode = 'random';
//gère le mode de IA vs IA 
function handleAIVsAI(selectedAIMode) {
  // Pour lancer la musique
  // const backgroundMusic = document.getElementById('iaVSia');
  // backgroundMusic.play();

  const delayBetweenMoves = 1000; //delay entre les mouvements de l'IA
  //constant pour gérer la séquence de mouvements des IA
  const playNextMove = () => {
    if (selectedAIMode === 'minimax') {
      makeMinimaxAIMove();
    } else {
      makeRandomAIMove();
    }
    //mise à jour de l'interface
    updateUI();

    if (checkEndGame(currentBoard)) {
      document.getElementById('game-message').textContent = 'Le jeu est terminé!';    
      // getWinner();
      stopBackgroundMusic();
      updateClickableCells();
      highlightCurrentPlayerMoves();
    } else {//si le jeu n'est pas terminé le tour passe au joueur suivant
      currentPlayer = currentPlayer === 'u' ? 'o' : 'u';
      setTimeout(playNextMove, delayBetweenMoves);
    }
  };

  // Commencez la séquence de mouvements
  playNextMove();
}

//fonction pour arreter la musique de fond
function stopBackgroundMusic() {
  if(backgroundMusic){
    backgroundMusic.pause();

}
}
//mise a jour de cellules cliquables 
function updateClickableCells() {
  const allCells = document.querySelectorAll('td');//sélectionne toutes les cellules du jeu
  allCells.forEach(cell => cell.classList.remove('highlight'));//parcours de cellules

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.querySelector(`#board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        cell.classList.add('highlight');//si le mouvement est valide la cellule devient 'highlighted'
      }
    }
  }
}


function highlightCurrentPlayerMoves() {
  // console.log(`Highlighting moves for player ${currentPlayer}`);
  const currentPlayerMoves = [];

  for (let i = 0; i < boardSize; i++) {//parcours des cellules 
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        currentPlayerMoves.push({ row: i, col: j });//si le mouvement est valide il y a un ajout de la position a la liste currentPlayerMoves
      }
    }
  }

  // console.log(`${currentPlayerMoves.length} moves highlighted.`);

  const boardElement = document.getElementById('board');

  // Supprimer tous les cercles existants avant d'ajouter les nouveaux
  const existingCircles = document.querySelectorAll('.circle');
  existingCircles.forEach(circle => circle.remove());

  currentPlayerMoves.forEach(move => {//parcours de la liste currentPlayerMoves
    const cell = boardElement.rows[move.row].cells[move.col];

    const circleDiv = document.createElement('div');
    circleDiv.className = 'circle';

    cell.appendChild(circleDiv);//pour chaque position valide un élément cercle est crée
  });
}

//Vérifie si un mouvement est valide pour un joueur donné à une position spécifique sur le plateau 
function isValidMove(row, col, currentBoard, currentPlayer) {
  if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || currentBoard[row][col] !== 'v') {
    return false;//Vérifie si la position est en dehors des limites du plateau ou si la cellule n'est pas vide ('v')
  }
//Liste des directions possibles pour vérifier les pièces adverses dans toutes les directions, 8 possibles
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
// Parcourt chaque direction pour vérifier la validité du mouvement
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let foundOpponentPiece = false;
// Parcourt les cases dans la direction spécifiée dans les limites du tableau
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      if (currentBoard[r][c] === currentPlayer) {// Si une pièce du joueur est trouvée après une pièce adverse, le mouvement est valide
        if (foundOpponentPiece) {
          return true;
        } else {// Si la première pièce rencontrée est du joueur actuel, on arrête la recherche dans cette direction
          break;
        }
      } else if (currentBoard[r][c] === 'v') {// Si une case vide est rencontrée, le mouvement n'est pas valide dans cette direction
        break;
      } else {// Si une pièce adverse est trouvée, on marque qu'une pièce adverse a été trouvée
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

function makeMove(row, col, currentBoard, currentPlayer) {//responsable pour effectuer un mouvement pour un joueur 
  console.log(`Making move at (${row}, ${col}) for player ${currentPlayer}`);
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];//tableau avec les 8 directions possibles 

  for (const [dr, dc] of directions) {//recherche des pièces à retourner dans chaque direction
    let r = row + dr; //verification de cellules adjacentes
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

//parcours du plateau du jeu pour compter les pièces noires et blanches
function updateScore() {
  let countBlack = 0;//initialisation de compteurs
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
//mise à jour d'scores globaux 
  scoreBlack = countBlack;
  scoreWhite = countWhite;
}

// Fonction pour faire un mouvement aléatoire
function makeRandomAIMove() {
  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);//fonction getAvailableMoves pour voir les mouvements disponibles sur le plateau

  if (availableMoves.length > 0) {//si il y a des mouvements disponibles sélectionne aléatoirement un mouvement disponible
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove.row, randomMove.col, currentBoard, currentPlayer);
  }
}

// Fonction pour faire un mouvement avec l'IA MinMax
function makeMinimaxAIMove() {
  const depth = 4;//profondeur de l'exploration des mouvements minmax
  // Version alpha beta
  // const alpha = -Infinity; // Initialisez alpha
  // const beta = Infinity; // Initialisez beta
  // const minimaxResult = minimax(currentBoard, depth, alpha, beta, currentPlayer);
  const minimaxResult = minimax(currentBoard, depth, currentPlayer);
  
  //si minimaxResult.move est défini cela signifie qu'il y a un mouvement valide à effectuer
  if (minimaxResult.move) {
    const minmaxMove = minimaxResult.move;
    makeMove(minmaxMove.row, minmaxMove.col, currentBoard, currentPlayer);//mouvement correspondant effectué
  } else {
    //sinon erreur
    console.error("Pas de mouvement valide trouvé par l'algorithme Minmax");
  }
}



// Fonction principale de l'algorithme minimax
function minimax(currentBoard, depth, maximizingPlayer) {
    // Si la profondeur maximale de recherche est atteinte ou le jeu est fini
  if (depth === 0 || checkEndGame(currentBoard)) {
    // Évalue la position actuelle du plateau
    const evaluation = evaluate(currentBoard, currentPlayer);
    // Affiche des informations de débogage sur la profondeur et l'évaluation
    console.log(`Profondeur: ${depth}, Evaluation: ${evaluation}`);
    return { score: evaluation, move: null };
  }

  // Détermine le joueur actuel et son adversaire en fonction du mode de maximisation
  const player = maximizingPlayer ? 'o' : 'u';
  const opponent = maximizingPlayer ? 'u' : 'o';

  const availableMoves = getAvailableMoves(currentBoard, currentPlayer);
  
  // Initialise le meilleur mouvement et le meilleur score en fonction du joueur maximisant
  let bestMove = availableMoves[0]; 
  let bestScore = maximizingPlayer ? -Infinity : Infinity;

  // Parcourt tous les mouvements possibles
  for (const move of availableMoves) {
    console.log(`Checking move at (${move.row}, ${move.col})`);
     // Copie le plateau pour simuler le mouvement sans affecter le plateau actuel
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
  //affiche dans le console les mouvements vérifiés, les scores obtenus et le meilleur mouvement identifié
  console.log(`Best move: ${bestMove ? `(${bestMove.row}, ${bestMove.col})` : 'null'}, Best score: ${bestScore}`);
    // Retourne le meilleur score et le meilleur mouvement associés
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


//voir le mouvements disponibles sur le plateau du jeu 
function getAvailableMoves(currentBoard, currentPlayer) {
  const availableMoves = [];

  for (let i = 0; i < boardSize; i++) {//parcours du plateau
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {//s'il y a un mouvement disponible lui ajouter au tableau availableMoves
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  return availableMoves;//retour du tableau
}
//determine si il y a des mouvements valides pour le joueur actuel
function hasValidMoves(currentBoard, currentPlayer) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, currentPlayer)) {
        return true;//si dans la position i,j il y a un mouvement valide retourne vrai
      }
    }
  }
  return false;//sinon retourne faux
}

//détérmine si le jeu est terminé
function checkEndGame(currentBoard) {
  for (let i = 0; i < boardSize; i++) {//parcours du plateau
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, currentBoard, 'u') || isValidMove(i, j, currentBoard, 'o')) {
        return false;
      }
    }
  }
  return true;//si les mouvements valides n'existent plus le jeu est terminé
}
//recherche le score plus haut pour definir le vainqueur
function getWinner() {
  if (scoreBlack > scoreWhite) {
    alert('Le joueur Noir a gagné!', '', 'success');
  } else if (scoreWhite > scoreBlack) {
    alert('Le joueur Blanc a gagné!', '', 'success');
  } else {
    alert('Match nul!', '', 'info');
  }
}

// Pour effectuer les test il faut décommenter cette partie.
function runAITests(numGamesToPlay) {
  const statistics = {
    numGames: 0,//nombre total de parties
    totalWinsBlack: 0,//nombre de victoires blanc
    totalWinsWhite: 0,//nombre de victoires noir
    totalTime: 0,//le temps total du test
    movesByPlayer: { u: [], o: [] },//les mouvements de chaque joueur
  };

  for (let i = 0; i < numGamesToPlay; i++) {//boucle le jeu 
    initializeBoard();

    const startTime = performance.now();//enregistre le début de la partie

    handleAIVsAI();//jeu d'une IA vs IA 

    const endTime = performance.now();//le fin de la partie
    const gameDuration = endTime - startTime;//temps de jeu
    statistics.totalTime += gameDuration;//ajoute de temps de chaque partie au temps total

    // Mesurez le nombre de coups dans chaque partie
    const movesBlack = getMovesByPlayer('u', i + 1);//mouvements du blanc
    const movesWhite = getMovesByPlayer('o', i + 1);//mouvements du noir

    statistics.movesByPlayer.u.push(movesBlack);//ajout dans le tableau movesByPlayer
    statistics.movesByPlayer.o.push(movesWhite);//ajout dans le tableau movesByPlayer

   

    statistics.numGames++; //ajout un jeu à chaque boucle

    if (scoreBlack > scoreWhite) {
      statistics.totalWinsBlack++;//si le noir a gagné augmente ses victoires
    } else if (scoreWhite > scoreBlack) {
      statistics.totalWinsWhite++;//si le blanc a gagné augmente ses victoires
    }
  }


  console.log('Statistiques des tests :', statistics);//affiche les statistiques sur la console du browser
  console.table(statistics);//fait une table avec les statistiques
  statistics.totalTime = 0;//remets le temps a 0 
}
//fonction pour récupérer et afficher la liste de mouvements effectués par un joueur
function getMovesByPlayer(currentPlayer, matchNumber) {
  const moves = [];//tableau avec les mouvements

  for (let i = 0; i < boardSize; i++) {//parcours du plateau
    for (let j = 0; j < boardSize; j++) {
      if (currentBoard[i][j] === currentPlayer) {//si une pièce du joueur est trouvée à la position i,j
        const position = `${String.fromCharCode(97 + j)}${i + 1}`;//la position est converti en une notation de mouvement
        moves.push(position);
      }
    }
  }
//affichage de la liste de mouvements dans la console du browser 
  console.log(`Match ${matchNumber}: Joueur ${currentPlayer === 'u' ? 'Noir' : 'Blanc'}, liste des mouvements: `, moves);

  return moves;
}

//initialisation au chargement de la page
window.onload = function () {
  initializeBoard();//initialise le plateau du jeu

  // Fonction pour démarrer le jeu en mode IA vs IA avec le mode sélectionné
  function startAIVsAI() {
    const selectedAIMode = document.getElementById('ai-mode').value;
    initializeBoard();
    handleAIVsAI(selectedAIMode);
  
  //  Pour les test il faut aussi décommenter cette partie, il est possible d'ajuster le nombre de parties que l'on veut tester. 
   let numGames;
   if (selectedAIMode === 'random') {
     numGames = 1000;
   } else if (selectedAIMode === 'minimax') {
     numGames = 100;
   }
//lancer 1000 tests d'IA 
   runAITests(numGames);
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
      
      updateUI(); // Ajoutez cette ligne pour mettre à jour l'interface utilisateur après la réinitialisation du plateau
    }
  });

  // Ajout de cette ligne pour démarrer automatiquement le jeu IA vs IA au chargement de la page
  if (boutonIA.checked) {
    startAIVsAI();
  }
};

