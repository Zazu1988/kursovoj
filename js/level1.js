﻿const taskText = document.getElementById('taskText'); //элемент для вывода текста задания
const container = document.getElementById('itemsContainer'); //область для вывода карточек

//весь список задач для раундов
const allTasks = [
    { key: 'color', value: 'красный', text: 'Найдите КРАСНЫЕ предметы' },
    { key: 'color', value: 'черный', text: 'Найдите ЧЕРНЫЕ предметы' },
    { key: 'material', value: 'металл', text: 'Найдите предметы из МЕТАЛЛА' },
    { key: 'material', value: 'дерево', text: 'Найдите предметы из ДЕРЕВА' },
    { key: 'shape', value: 'круглая', text: 'Найдите КРУГЛЫЕ предметы' },
    { key: 'shape', value: 'прямоугольная', text: 'Найдите ПРЯМОУГОЛЬНЫЕ предметы' },
    { key: 'color', value: 'синий', text: 'Найдите СИНИЕ предметы' }
];

//перемешиваем задачи и выбираем 5 раундов
let levelTasks = [...allTasks].sort(() => 0.5 - Math.random()).slice(0, 5);
let round = 0; //номер текущего раунда
const maxRounds = 5; 

function startTask() {
    //проверка завершения всех раундов
    if (round >= maxRounds) {
        saveProgress(); //сохраняем очки (функция из game.js)
        alert("Уровень 1 пройден! Переходим к сортировке.");
        //переход на второй уровень через nextLevel() из game.js
        if (typeof nextLevel === 'function') {
            nextLevel();
        } else {
            // Если функция недоступна, делаем прямой переход
            gameState.level = 2;
            saveProgress();
            // Укажи правильное название файла
            window.location.href = 'level2.html'; // или 'kursovoj_level2.html'
        }
        return;
    }

    //получаем текущее задание
    const cur = levelTasks[round];
    taskText.textContent = `Раунд ${round + 1}/${maxRounds}: ${cur.text}`;
    container.innerHTML = ''; //очистка поля
    
    //выбираем 10 случайных предметов из базы data.js
    const pool = [...items].sort(() => 0.5 - Math.random()).slice(0, 10);
    //считаем, сколько из них правильных
    let needed = pool.filter(i => i[cur.key] === cur.value).length;

    //если правильных предметов не выпало, перезапускаем подбор раунда
    if (needed === 0) { startTask(); return; }

    //создаем карточки предметов
    pool.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item';
        card.innerHTML = `<img src="${item.image}" class="item-image"><div>${item.name}</div>`;
        
        //обработка двойного клика
        card.addEventListener('dblclick', () => {

    // если карточка уже была выбрана — ничего не делаем
    if (card.classList.contains('correct') || card.classList.contains('wrong')) {
        return;
    }

    if (item[cur.key] === cur.value) {
        card.classList.add('correct');
        updateScore(10);
        needed--;

        if (needed === 0) {
            round++;
            setTimeout(startTask, 1000);
        }
    } else {
        card.classList.add('wrong');
        updateScore(-5);
    }
});

        container.appendChild(card); //добавляем на страницу
    });
}

startTask(); //запуск игры