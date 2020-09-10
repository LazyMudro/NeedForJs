const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    hightscore = document.querySelector('.hightscore');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    hightscoreValue: 0,
    speed: 5,
    traffic: 2
};

if (localStorage.prevHightscore) {
    setting.hightscoreValue = Number(localStorage.prevHightscore);
} else {
    localStorage.setItem('prevHightscore', 0);
}

function setHitghtscore() {
    if (setting.score > setting.hightscoreValue) {
        setting.hightscoreValue = setting.score;
    }
}

function getQuantityElemets(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}




function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    for (let i = 0; i < getQuantityElemets(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    for (let i = 0; i < getQuantityElemets(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * i + 1;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        setHitghtscore()
        score.innerHTML = 'SCORE<br> ' + setting.score;
        moveRoad();
        hightscore.innerHTML = 'HIGHTSCORE: ' + setting.hightscoreValue;
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - 50)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - 102)) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        car.style.top = setting.y + 'px';
        car.style.left = setting.x + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y > document.documentElement.clientHeight + 50) {
            line.y = -100;
        }
    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom - 2 &&
            carRect.right >= enemyRect.left + 2 &&
            carRect.left <= enemyRect.right - 2 &&
            carRect.bottom >= enemyRect.top + 2) {
            if (Number(localStorage.getItem('prevHightscore')) < setting.hightscoreValue) {
                localStorage.setItem('prevHightscore', Number(setting.hightscoreValue))
                alert('Вы побили рекорд!')
            }
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}