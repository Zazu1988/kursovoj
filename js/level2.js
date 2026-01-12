const container = document.getElementById('itemsContainer');
const bins = [document.getElementById('bin1'), document.getElementById('bin2')];

const tasks = [
    { label: 'Материал', key: 'material', v1: 'металл', v2: 'дерево' },
    { label: 'Цвет', key: 'color', v1: 'красный', v2: 'белый' },
    { label: 'Форма', key: 'shape', v1: 'круглая', v2: 'прямоугольная' }
].sort(() => 0.5 - Math.random());

let round = 0;

function initLevel() {
    if (round >= 3) {
        alert("Уровень 2 пройден!");
        nextLevel();
        return;
    }

    const cur = tasks[round];
    document.getElementById('taskText').textContent = `Сортировка: ${cur.label}`;

    // настройка корзин
    bins.forEach((bin, index) => {
        const value = index === 0 ? cur.v1 : cur.v2;
        bin.dataset.target = value;
        bin.querySelector('.bin-label').textContent = value;
        bin.querySelector('.bin-items').innerHTML = '';
    });

    container.innerHTML = '';

    items
        .filter(i => i[cur.key] === cur.v1 || i[cur.key] === cur.v2)
        .slice(0, 6)
        .forEach(item => {
            const card = document.createElement('div');
            card.className = 'item';
            card.draggable = true;
            card.innerHTML = `
                <img src="${item.image}">
                <div>${item.name}</div>
            `;

            card.ondragstart = e => {
                e.dataTransfer.setData('item', JSON.stringify(item));
                card.classList.add('dragging');
            };

            card.ondragend = () => card.classList.remove('dragging');

            container.appendChild(card);
        });
}

// обработка корзин
bins.forEach(bin => {
    bin.ondragover = e => e.preventDefault();

    bin.ondrop = e => {
        e.preventDefault();

        const dragged = document.querySelector('.dragging');
        if (!dragged) return;

        const data = JSON.parse(e.dataTransfer.getData('item'));
        const cur = tasks[round];

        if (data[cur.key] === bin.dataset.target) {
            updateScore(15);

            dragged.draggable = false;
            dragged.classList.remove('dragging');
            bin.querySelector('.bin-items').appendChild(dragged);

            if (container.children.length === 0) {
                round++;
                setTimeout(initLevel, 500);
            }
        } else {
            updateScore(-10);
            bin.classList.add('error');
	    setTimeout(() => bin.classList.remove('error'), 400);
        }
    };
});

initLevel();
