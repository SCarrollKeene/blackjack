/*
* Blackjack by Stephen Carroll-Keene
*/

// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack',
  'Ten', 'Nine', 'Eight', 'Seven', 'Six',
  'Five', 'Four', 'Three', 'Two'];

// DOM variables stored in elements object
let elements = {
    textArea: document.getElementById('text-area'),
    newGameButton: document.getElementById('new-game-button'),
    hitButton: document.getElementById('hit-button'),
    stayButton: document.getElementById('stay-button')
};

// Game Variables
let gameStart = false,
  gameOver = false,
  playerWin = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

// hides hit/stay until new game event listener is triggered by 'click'
elements.hitButton.style.display = 'none';
elements.stayButton.style.display = 'none';
showStatus();

// handler for when player clicks new game button
elements.newGameButton.addEventListener('click', () => {
  gameStart = true;
  gameOver = false;
  playerWin = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  elements.newGameButton.style.display = 'none';
  elements.hitButton.style.display = 'inline';
  elements.stayButton.style.display = 'inline';
  showStatus();
});

elements.hitButton.addEventListener('click', () => {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

elements.stayButton.addEventListener('click', () => {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = []; // deck is clear, equals empty array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      let card = {
        suit: suits[suitIndex],
        value: values[valueIndex]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIndex]; // temporarily hold onto deck index
    deck[swapIndex] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value + ' of ' + card.suit;
}

function getNextCard() {
  return deck.shift(); // take 1st value off and shift cards down in the array
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  updateScores();

  if(gameOver) {
    // let Dealer take cards
    while(dealerScore < playerScore
    && playerScore <= 21
    && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWin = false;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWin = true;
    gameOver = true;
  }
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWin = true;
    }
    else {
      playerWin = false;
    }
  }
}

function showStatus() {
  if (!gameStart) {
    elements.textArea.innerText = "Welcome to Blackjack!";
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  elements.textArea.innerText =
  'Dealer has:\n' +
  dealerCardString +
  '(score: ' + dealerScore + ')\n\n' +

  'Player has:\n' +
  playerCardString +
  '(score: ' + playerScore + ')\n\n';

  if(gameOver) {
    if(playerWin) {
      elements.textArea.innerText += "WINNER!";
    }
    else if (dealerScore === playerScore) {
      elements.textArea.innerText += "TIE GAME!";
    }
    else if (dealerScore === 21
    && playerScore === 21) {
      elements.textArea.innerText += 'TIE GAME!';
    }
    else {
      elements.textArea.innerText += "DEALER WINS!";
    }

    elements.newGameButton.style.display = 'inline';
    elements.hitButton.style.display = 'none';
    elements.stayButton.style.display = 'none';
  }
}
