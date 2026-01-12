﻿// Управление таймером и очками
let playerData = JSON.parse(localStorage.getItem('currentPlayer'));

const gameState = {
    score: (playerData && playerData.score) || 0,
    level: (playerData && playerData.level) || 1 
};

const scoreField = document.getElementById('score');
const timeField = document.getElementById('time');
const levelField = document.getElementById('level');
const nameField = document.getElementById('playerName');

if (nameField && playerData && nameField.tagName !== 'INPUT') nameField.textContent = playerData.name;
if (scoreField) scoreField.textContent = gameState.score;
if (levelField) levelField.textContent = gameState.level;

let timer = null;

if (playerData && timeField) {
    let timeLeft = 60;
    timeField.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timeField.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(); 
        }
    }, 1000);
}

function updateScore(value) {
    gameState.score += value;
    if (scoreField) scoreField.textContent = gameState.score;
}

function saveProgress() {
    if (playerData) {
        playerData.score = gameState.score;
        playerData.level = gameState.level;
        localStorage.setItem('currentPlayer', JSON.stringify(playerData));
    }
}

// Функция перехода на следующий уровень
function nextLevel() {
    clearInterval(timer);
    saveProgress();

    // Получаем текущий URL
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('level1.html')) {
        gameState.level = 2;
        saveProgress();
        // Проверяем, какой у тебя реальный файл называется
        window.location.href = 'level2.html'; // или 'kursovoj_level2.html'
    } 
    else if (currentPath.includes('level2.html') || currentPath.includes('kursovoj_level2')) {
        gameState.level = 3;
        saveProgress();
        window.location.href = 'level3.html'; // или 'kursovoj_level3.html'
    } 
    else {
        finalizeGame();
    }
}

function endGame() {
    clearInterval(timer);
    if (typeof spawnInterval !== 'undefined') clearInterval(spawnInterval);
    saveProgress();

    const currentPath = window.location.pathname;
    
    if (currentPath.includes('level3.html') || currentPath.includes('kursovoj_level3')) {
        finalizeGame();
    } else {
        alert(`Время вышло! Счет: ${gameState.score}`);
        window.location.href = '../index.html'; 
    }
}

function finalizeGame() {
    if (playerData && playerData.name !== "Гость") {
        let history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        const idx = history.findIndex(p => p.name === playerData.name);
        
        // Только обновляем если новый счет выше
        if (idx !== -1) {
            if (gameState.score > history[idx].score) {
                history[idx].score = gameState.score;
                history.sort((a, b) => b.score - a.score);
                localStorage.setItem('gameHistory', JSON.stringify(history));
            }
        } else {
            history.push({ name: playerData.name, score: gameState.score });
            history.sort((a, b) => b.score - a.score);
            localStorage.setItem('gameHistory', JSON.stringify(history));
        }
    }
    window.location.href = 'rating.html'; 
}

// Логика кнопки НАЧАТЬ ИГРУ (index.html)
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.onclick = () => {
            const name = document.getElementById('playerName').value.trim();
            if (!name) return;
            playerData = { name: name, score: 0, level: 1 };
            localStorage.setItem('currentPlayer', JSON.stringify(playerData));
            window.location.href = 'pages/level1.html';
        };
    }
});

function debugNavigate(page, level) {
    // Очищаем перед созданием гостя
    localStorage.removeItem('currentPlayer');
    const guestData = { name: "Гость", score: 0, level: level };
    localStorage.setItem('currentPlayer', JSON.stringify(guestData));
    window.location.href = page;
}

function goToMain() {
    localStorage.removeItem('currentPlayer');
    window.location.href = '../index.html';
}