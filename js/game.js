﻿// ================================
// GAME CORE (timer, score, hints)
// ================================

let gamePaused = false;

/* ===== ДАННЫЕ ИГРОКА ===== */
let playerData = JSON.parse(localStorage.getItem('currentPlayer'));

const gameState = {
    score: (playerData && playerData.score) || 0,
    level: (playerData && playerData.level) || 1
};

/* ===== UI ===== */
const scoreField = document.getElementById('score');
const timeField = document.getElementById('time');
const levelField = document.getElementById('level');
const nameField = document.getElementById('playerName');

if (nameField && playerData && nameField.tagName !== 'INPUT') {
    nameField.textContent = playerData.name;
}
if (scoreField) scoreField.textContent = gameState.score;
if (levelField) levelField.textContent = gameState.level;

/* ===== ТАЙМЕР ===== */
let timer = null;
let timeLeft = 60;

function startTimer() {
    if (timer || !timeField) return;

    timer = setInterval(() => {
        if (gamePaused) return;

        timeLeft--;
        timeField.textContent = timeLeft;

        if (timeLeft <= 0) {
            stopTimer();
            endGame();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

if (playerData && timeField) {
    timeField.textContent = timeLeft;
    startTimer();
}

/* ===== ОЧКИ ===== */
function updateScore(value) {
    gameState.score += value;
    if (scoreField) scoreField.textContent = gameState.score;
}

/* ===== СОХРАНЕНИЕ ===== */
function saveProgress() {
    if (!playerData) return;
    playerData.score = gameState.score;
    playerData.level = gameState.level;
    localStorage.setItem('currentPlayer', JSON.stringify(playerData));
}

/* ===== ПЕРЕХОДЫ ===== */
function nextLevel() {
    stopTimer();
    saveProgress();

    const path = window.location.pathname;

    if (path.includes('level1')) {
        gameState.level = 2;
        saveProgress();
        window.location.href = 'level2.html';
    }
    else if (path.includes('level2')) {
        gameState.level = 3;
        saveProgress();
        window.location.href = 'level3.html';
    }
    else {
        finalizeGame();
    }
}

function endGame() {
    stopTimer();
    if (typeof spawnInterval !== 'undefined') clearInterval(spawnInterval);
    saveProgress();

    const path = window.location.pathname;
    if (path.includes('level3')) {
        finalizeGame();
    } else {
        alert(`Время вышло! Счет: ${gameState.score}`);
        window.location.href = '../index.html';
    }
}

function finalizeGame() {
    if (playerData && playerData.name !== 'Гость') {
        let history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        const idx = history.findIndex(p => p.name === playerData.name);

        if (idx !== -1) {
            if (gameState.score > history[idx].score) {
                history[idx].score = gameState.score;
            }
        } else {
            history.push({ name: playerData.name, score: gameState.score });
        }

        history.sort((a, b) => b.score - a.score);
        localStorage.setItem('gameHistory', JSON.stringify(history));
    }

    window.location.href = 'rating.html';
}

/* ===== НАЧАТЬ ИГРУ ===== */
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (!startBtn) return;

    startBtn.onclick = () => {
        const name = document.getElementById('playerName').value.trim();
        if (!name) return;

        playerData = { name, score: 0, level: 1 };
        localStorage.setItem('currentPlayer', JSON.stringify(playerData));
        window.location.href = 'pages/level1.html';
    };
});

/* ===== DEBUG ===== */
function debugNavigate(page, level) {
    localStorage.removeItem('currentPlayer');
    localStorage.setItem('currentPlayer', JSON.stringify({
        name: 'Гость',
        score: 0,
        level
    }));
    window.location.href = page;
}

function goToMain() {
    localStorage.removeItem('currentPlayer');
    window.location.href = '../index.html';
}

/* ======================================
   ПОДСКАЗКА (Alt + 1)
====================================== */
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === '1') {
            openHint();
        }
    });

    const okBtn = document.getElementById('hintOkBtn');
    if (okBtn) {
        okBtn.onclick = closeHint;
    }
});

function openHint() {
    const modal = document.getElementById('hintModal');
    const content = document.getElementById('hintContent');

    if (!modal || !content) {
        console.error('hintModal не найден в HTML');
        return;
    }

    if (gamePaused) return;

    gamePaused = true;
    stopTimer();

    document.dispatchEvent(new Event('hintOpened'));

    let text = '';
    switch (gameState.level) {
        case 1:
            text = 'Выделяйте нужные предметы двойным кликом ЛКМ. Каждый предмет можно выбрать только один раз.';
            break;
        case 2:
            text = 'Перетаскивайте карточки в правильные корзины. Ошибка — минус очки.';
            break;
        case 3:
            text = 'Кликайте по нужным предметам до того, как они упадут.';
            break;
    }

    content.textContent = text;
    modal.classList.add('active');
}


function closeHint() {
    const modal = document.getElementById('hintModal');
    modal.classList.remove('active');

    gamePaused = false;
    startTimer();

    document.dispatchEvent(new Event('hintClosed'));
}
