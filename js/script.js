let deck = [];
let playerHand = [];
let dealerHand = [];
let gameEnded = false;

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

    // Funciones del juego
    function createDeck() {
        const suits = ['C', 'D', 'H', 'S'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let newDeck = [];
        for (let suit of suits) {
            for (let value of values) {
                newDeck.push({ suit, value });
            }
        }
        return newDeck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function drawCard() {
        return deck.pop();
    }

    function getHandValue(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            if (['J', 'Q', 'K'].includes(card.value)) value += 10;
            else if (card.value === 'A') { value += 11; aces += 1; }
            else value += parseInt(card.value);
        }
        while (value > 21 && aces > 0) { value -= 10; aces -= 1; }
        return value;
    }

    function createCardElement(card) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        const suitNames = { 'C': 'clubs', 'D': 'diamonds', 'H': 'hearts', 'S': 'spades' };
        const fileName = `${suitNames[card.suit]}_${card.value}.png`;
        cardDiv.style.backgroundImage = `url('assets/cards/${fileName}')`;
        return cardDiv;
    }

    function updateHands() {
        const playerDiv = document.getElementById("player-hand");
        const dealerDiv = document.getElementById("dealer-hand");
        playerDiv.innerHTML = "";
        dealerDiv.innerHTML = "";

        if (gameEnded) {
            dealerHand.forEach(card => dealerDiv.appendChild(createCardElement(card)));
        } else {
            dealerDiv.appendChild(createCardElement(dealerHand[0]));
            if (dealerHand.length > 1) {
                const hiddenCard = document.createElement("div");
                hiddenCard.className = "card";
                hiddenCard.style.background = "#0a5c36";
                dealerDiv.appendChild(hiddenCard);
            }
        }

        playerHand.forEach(card => playerDiv.appendChild(createCardElement(card)));
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
        const playerValue = getHandValue(playerHand);
        if (playerValue > 21) endGame("Te pasaste! Has perdido.");
        else if (playerValue === 21) document.getElementById("result").textContent = "Tienes 21!";
    }

    function stand() {
        if (gameEnded) return;
        while (getHandValue(dealerHand) < 17) dealerHand.push(drawCard());
        updateHands();
        const playerValue = getHandValue(playerHand);
        const dealerValue = getHandValue(dealerHand);

        if (playerValue > 21) endGame("Te pasaste. Perdiste!");
        else if (dealerValue > 21) endGame("El dealer se pasó. Ganaste!");
        else if (playerValue > dealerValue) endGame("Ganaste!");
        else if (playerValue < dealerValue) endGame("Perdiste! Gana el dealer.");
        else endGame("Empate!");
    }

    // --- EVENTOS ---
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
    });

    enableControls(false);
});
