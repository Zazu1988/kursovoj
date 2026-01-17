﻿let isPaused = false; 
const gameArea = document.getElementById('gameArea'); 

const possible = [
    { key: 'material', value: 'металл', text: 'Ловите МЕТАЛЛ!' },
    { key: 'material', value: 'дерево', text: 'Ловите ДЕРЕВО!' },
    { key: 'color', value: 'красный', text: 'Ловите КРАСНОЕ!' },
    { key: 'shape', value: 'круглая', text: 'Ловите КРУГЛОЕ!' }
];

const curTask = possible[Math.floor(Math.random() * possible.length)];
document.getElementById('taskText').textContent = curTask.text;

let gameSpeed = 3; 

document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden; 
});

function isOverlapping(x, y) {
    const items = document.querySelectorAll('.flying-item');
    for (let item of items) {
        const rect = item.getBoundingClientRect();
        const areaRect = gameArea.getBoundingClientRect();
        const itemX = rect.left - areaRect.left;
        const itemY = rect.top - areaRect.top;

        // Радиус проверки 85px для предметов 80px
        if (Math.abs(itemX - x) < 85 && Math.abs(itemY - y) < 85) {
            return true;
        }
    }
    return false;
}

function spawn() {
    if (isPaused) return;

    const isTarget = Math.random() < 0.6;
    const pool = isTarget
        ? items.filter(i => i[curTask.key] === curTask.value)
        : items;

    const data = pool[Math.floor(Math.random() * pool.length)];

    const el = document.createElement('div');
    el.className = 'flying-item';

    let x = Math.random() * (gameArea.clientWidth - 80);
    let y = -100;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.innerHTML = `<img src="${data.image}" draggable="false">`;

    gameArea.appendChild(el);

    // Горизонтальная скорость (хаотичная)
    let dx = (Math.random() * 2 - 1) * 2;

    // Вертикальная скорость зависит от оставшегося времени
    const timeLeft = parseInt(document.getElementById('time').textContent) || 60;
    let speed = gameSpeed + (60 - timeLeft) * 0.05;

    const fall = setInterval(() => {
        if (isPaused) return;

        // случайно меняем направление
        if (Math.random() < 0.03) {
            dx = (Math.random() * 2 - 1) * (2 + speed * 0.3);
        }

        x += dx;
        y += speed;

        // отскок от стен
        if (x <= 0 || x >= gameArea.clientWidth - 80) {
            dx *= -1;
        }

        el.style.left = x + 'px';
        el.style.top = y + 'px';

        if (y > gameArea.clientHeight) {
            clearInterval(fall);
            el.remove();
        }
    }, 20);

    el.onmousedown = (e) => {
        e.preventDefault();
        clearInterval(fall);

        // взрыв
        explode(el);

        if (data[curTask.key] === curTask.value) {
            updateScore(20);
            gameSpeed += 0.3;
        } else {
            updateScore(-15);
        }

        el.remove();
    };
}

function explode(target) {

    const sound = document.getElementById('explosionSound');
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
    const rect = target.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();

    const centerX = rect.left - areaRect.left + rect.width / 2;
    const centerY = rect.top - areaRect.top + rect.height / 2;

    // Основная вспышка
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = (centerX - 40) + 'px';
    explosion.style.top = (centerY - 40) + 'px';
    gameArea.appendChild(explosion);

    setTimeout(() => explosion.remove(), 400);

    // Осколки
    const fragmentsCount = 10 + Math.floor(Math.random() * 6);

    for (let i = 0; i < fragmentsCount; i++) {
        const frag = document.createElement('div');
        frag.className = 'fragment';

        frag.style.left = centerX + 'px';
        frag.style.top = centerY + 'px';

        gameArea.appendChild(frag);

        // Случайное направление
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 40;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            frag.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
            frag.style.opacity = '0';
        });

        setTimeout(() => frag.remove(), 600);
    }
}



const spawnInterval = setInterval(spawn, 1000);
