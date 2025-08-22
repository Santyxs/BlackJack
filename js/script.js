// Cómo jugar
const howtoBtn = document.getElementById('howto-btn');
const howtoPanel = document.getElementById('how-to-play');
const closeHowtoBtn = document.getElementById('close-howto-btn');

howtoBtn.addEventListener('click', () => {
  howtoPanel.style.display = 'flex';
  menu.style.display = 'none';
});

closeHowtoBtn.addEventListener('click', () => {
  howtoPanel.style.display = 'none';
  menu.style.display = 'flex';
});

// Variables del juego
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameEnded = false;

// Puntuación
let wins = 0, losses = 0, ties = 0;

// Opciones
let playerName = localStorage.getItem('playerName') || "Tú";
let showCardPoints = localStorage.getItem('showCardPoints') === "true";

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const menu = document.getElementById('menu');
  const game = document.getElementById('game');
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');
  const restartBtn = document.getElementById('restart-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings');
  const saveSettingsBtn = document.getElementById('save-settings');
  const usernameInput = document.getElementById('username');
  const playerNameCell = document.getElementById('player-name');
  const showPointsCheckbox = document.getElementById('show-points');

  // Elementos para mostrar nombre del jugador
  playerNameCell.textContent = playerName;

  // Elemento para mostrar puntuación de cartas
  showPointsCheckbox.checked = showCardPoints;

  function createDeck() {
    const suits = ['C', 'D', 'H', 'S'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let newDeck = [];
    suits.forEach(suit => values.forEach(value => newDeck.push({ suit, value })));
    return newDeck;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function drawCard() { return deck.pop(); }

  function getHandValue(hand) {
    let value = 0, aces = 0;
    hand.forEach(card => {
      if (['J', 'Q', 'K'].includes(card.value)) value += 10;
      else if (card.value === 'A') { value += 11; aces++; }
      else value += parseInt(card.value);
    });
    while (value > 21 && aces > 0) { value -= 10; aces--; }
    return value;
  }

  function createCardElement(card) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.position = "relative";
    const suits = { 'C': 'clubs', 'D': 'diamonds', 'H': 'hearts', 'S': 'spades' };
    div.style.backgroundImage = `url('assets/cards/${suits[card.suit]}_${card.value}.png')`;

    return div;
  }

  function updateHands() {
    const playerDiv = document.getElementById("player-hand");
    const dealerDiv = document.getElementById("dealer-hand");
    playerDiv.innerHTML = "";
    dealerDiv.innerHTML = "";

    // Mostrar cartas del dealer
    if (gameEnded) {
      dealerHand.forEach(card => dealerDiv.appendChild(createCardElement(card)));
    } else {
      dealerDiv.appendChild(createCardElement(dealerHand[0]));
      if (dealerHand.length > 1) {
        const hidden = document.createElement("div");
        hidden.className = "card";
        hidden.style.background = "#0a5c36";
        dealerDiv.appendChild(hidden);
      }
    }

    // Mostrar cartas del jugador
    playerHand.forEach(card => playerDiv.appendChild(createCardElement(card)));

    // Mostrar total de puntos si está activado
    const playerTotalDiv = document.getElementById("player-total") || document.createElement("div");
    playerTotalDiv.id = "player-total";
    playerTotalDiv.style.marginTop = "10px";
    playerTotalDiv.style.fontWeight = "bold";
    playerTotalDiv.style.color = "#ffcc00";
    playerTotalDiv.textContent = showCardPoints ? `Total: ${getHandValue(playerHand)}` : "";
    if (!document.getElementById("player-total")) playerDiv.parentNode.insertBefore(playerTotalDiv, playerDiv.nextSibling);

    const dealerTotalDiv = document.getElementById("dealer-total") || document.createElement("div");
    dealerTotalDiv.id = "dealer-total";
    dealerTotalDiv.style.marginTop = "10px";
    dealerTotalDiv.style.fontWeight = "bold";
    dealerTotalDiv.style.color = "#ffcc00";
    dealerTotalDiv.textContent = showCardPoints ? `Total: ${getHandValue(dealerHand)}` : "";
    if (!document.getElementById("dealer-total")) dealerDiv.parentNode.insertBefore(dealerTotalDiv, dealerDiv.nextSibling);
  }

  function enableControls(enable) {
    hitBtn.disabled = !enable;
    standBtn.disabled = !enable;
  }

  function endGame(message) {
    gameEnded = true;
    document.getElementById("result").textContent = message;
    enableControls(false);
    updateHands();
    playAgainBtn.style.display = "inline-block";

    if (message.includes("Ganaste")) wins++;
    else if (message.includes("Perdiste")) losses++;
    else if (message.includes("Empate")) ties++;

    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    document.getElementById("ties").textContent = ties;
  }

  function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard()];
    gameEnded = false;
    updateHands();
    document.getElementById("result").textContent = "";
    playAgainBtn.style.display = "none";
    enableControls(true);
    if (getHandValue(playerHand) === 21) endGame("Blackjack! Ganaste!");
  }

  function hit() {
    if (gameEnded) return;
    playerHand.push(drawCard());
    updateHands();
    const val = getHandValue(playerHand);
    if (val > 21) endGame("Te pasaste! Has perdido.");
    else if (val === 21) document.getElementById("result").textContent = "Tienes 21!";
  }

  function stand() {
    if (gameEnded) return;
    while (getHandValue(dealerHand) < 17) dealerHand.push(drawCard());
    updateHands();
    const pVal = getHandValue(playerHand);
    const dVal = getHandValue(dealerHand);
    if (pVal > 21) endGame("Te pasaste. Perdiste!");
    else if (dVal > 21) endGame("El dealer se pasó. Ganaste!");
    else if (pVal > dVal) endGame("Ganaste!");
    else if (pVal < dVal) endGame("Perdiste! Gana el dealer.");
    else endGame("Empate!");
  }

  startBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    game.style.display = 'block';
    startGame();
  });

  hitBtn.addEventListener('click', hit);
  standBtn.addEventListener('click', stand);
  restartBtn.addEventListener('click', () => {
    game.style.display = 'none';
    menu.style.display = 'block';
  });
  playAgainBtn.addEventListener('click', startGame);

  settingsToggle.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    usernameInput.value = playerName;
    showPointsCheckbox.checked = showCardPoints;
  });

  saveSettingsBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
      playerName = name;
      playerNameCell.textContent = playerName;
      localStorage.setItem('playerName', playerName);
    }
    showCardPoints = showPointsCheckbox.checked;
    localStorage.setItem('showCardPoints', showCardPoints);
    settingsPanel.style.display = 'none';
    updateHands();
  });

  enableControls(false);
});
