document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const restartBtn = document.getElementById('restart-btn');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings');

    enableControls(false);

    startBtn.addEventListener('click', () => {
        menu.style.display = 'none';
        game.style.display = 'block';
        window.startGame();
        enableControls(true);
    });

    restartBtn.addEventListener('click', () => {
        game.style.display = 'none';
        menu.style.display = 'flex';
        enableControls(false);
        document.getElementById('result').textContent = '';
        document.getElementById('player-hand').innerHTML = '';
        document.getElementById('dealer-hand').innerHTML = '';
    });

    hitBtn.addEventListener('click', () => {
        window.hit();
    });

    standBtn.addEventListener('click', () => {
        window.stand();
    });

    settingsToggle.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    });
});
