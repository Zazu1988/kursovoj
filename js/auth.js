const nameInput = document.getElementById('playerName');
const startButton = document.getElementById('startBtn');

if (startButton) {
    startButton.addEventListener('click', startGame);
}

function startGame() {
    const playerName = nameInput.value.trim();
    if (playerName === '') {
        alert('Пожалуйста, введите имя');
        return;
    }
    const player = { name: playerName, score: 0, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    window.location.href = '../pages/level1.html';
}

function debugNavigate(targetUrl, level) {
    localStorage.removeItem('currentPlayer');
    const guestPlayer = { name: "Гость", score: 0, level: level };
    localStorage.setItem('currentPlayer', JSON.stringify(guestPlayer));
    window.location.href = targetUrl;
}

function retryGame(name) {
    const player = { name: name, score: 0, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    window.location.href = '../pages/level1.html';
}

function goToMain() {
    localStorage.removeItem('currentPlayer');
    window.location.href = '../index.html';
}