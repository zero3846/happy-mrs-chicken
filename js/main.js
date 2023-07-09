let canvas;
let ctx;

const initGameOverTime_secs = 15;
const chickenRadius = 80;
const eggRadius = 30;
const bonusRadius = 30;
const bonusFreq_secs = 5;
const bonusExpire_secs = 2;
const bonusExtension_secs = 5;

let chickenImage;

let state = "new-game";
let score = 0;
let startTime_msecs = 0;
let gameOverTime_msecs = 0;
let timeLeft_secs = 0;
let nextBonus_msecs = 0;
let chicken = {
    x: 0,
    y: 0
};
let eggs = [];
let bonuses = [];

function init() {
    let pathContext = window.location.pathname;
    pathContext = pathContext.substring(0, pathContext.lastIndexOf('/') + 1);
    console.log(window.location.href, pathContext);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register(pathContext + 'service-worker.js', {
                    scope: pathContext
                })
                .then(reg => console.log('Service Worker: Registered'))
                .catch(err => console.log(`Service Worker: Error: ${err}`));
        });
    }

    const contentElem = document.querySelector('#content');

    canvas = document.querySelector('#canvas');
    canvas.width = contentElem.clientWidth;
    canvas.height = contentElem.clientHeight;
    canvas.addEventListener('click', handleClick);

    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    chickenImage = new Image(2 * chickenRadius, 2 * chickenRadius);
    chickenImage.src = "images/chicken.png";

    const newGameButton = document.querySelector('#new-game-button');
    newGameButton.addEventListener('click', newGameButtonClicked);
}

function animate(now) {
    update();
    draw();
    window.requestAnimationFrame(animate);
}

function start() {
    window.requestAnimationFrame(animate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state === 'game-started') {
        for (const egg of eggs) {
            drawEgg(egg);
        }

        drawChicken(chicken);

        for (const bonus of bonuses) {
            drawBonus(bonus);
        }

        const timeLeftElem = document.querySelector('#time-left');
        timeLeftElem.innerText = `${timeLeft_secs.toFixed(0)}`;

        const scoreElem = document.querySelector('#score');
        scoreElem.innerText = `${score}`;
    } else if (state === 'game-over') {
        const message = score > 0 ? `You have scored ${score}!`
            : "You didn't score anything!";

        const messageElem = document.querySelector('#new-game h1');
        messageElem.innerText = message;

        const newGamePanel = document.querySelector('#new-game');
        newGamePanel.style.visibility = 'visible';
    }
}

function drawChicken(chicken) {
    const imageWidth = 2 * chickenRadius;
    const imageHeight = 2 * chickenRadius;

    ctx.drawImage(chickenImage,
        chicken.x - imageWidth / 2,
        chicken.y - imageHeight / 2,
        imageWidth,
        imageHeight);
}

function drawEgg(egg) {
    const eggRadiusLong = 1.5 * eggRadius;

    ctx.beginPath();
    ctx.arc(egg.x, egg.y, eggRadius, 0, Math.PI);
    ctx.ellipse(egg.x, egg.y, eggRadius, eggRadiusLong, 0, Math.PI, 2 * Math.PI);

    ctx.lineWidth = 6;
    ctx.strokeStyle = 'gray';
    ctx.stroke();

    ctx.fillStyle = 'lightgoldenrodyellow';
    ctx.fill();
}

function drawBonus(bonus) {
    const clockFaceRadius = 0.7 * bonusRadius;
    const clockRadius = 0.9 * bonusRadius;
    const handWidth = 0.15 * bonusRadius;
    const hourHandLength = 0.4 * bonusRadius;
    const minuteHandLength = 0.5 * bonusRadius;
    const plusOffset = 0.2;
    const plusX = bonus.x + (1 - plusOffset) * bonusRadius;
    const plusY = bonus.y - (1 - plusOffset) * bonusRadius;
    const plusRadius = 0.2 * bonusRadius;

    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, clockRadius, 0, Math.PI * 2);

    ctx.fillStyle = 'darkred';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, clockFaceRadius, 0, Math.PI * 2);

    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bonus.x, bonus.y - minuteHandLength);
    ctx.lineTo(bonus.x, bonus.y);
    ctx.lineTo(bonus.x + hourHandLength, bonus.y);

    ctx.lineWidth = handWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(plusX - plusRadius, plusY);
    ctx.lineTo(plusX + plusRadius, plusY);
    ctx.moveTo(plusX, plusY - plusRadius);
    ctx.lineTo(plusX, plusY + plusRadius);

    ctx.lineWidth = handWidth;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = 'green';
    ctx.stroke();
}

function update() {
    if (state === 'game-started') {
        const elapsed_msecs = Date.now() - startTime_msecs;
        timeLeft_secs = (gameOverTime_msecs - elapsed_msecs) / 1000;

        updateBonuses(elapsed_msecs);

        if (elapsed_msecs >= gameOverTime_msecs) {
            state = 'game-over';
        }
    } else if (state === 'new-game') {
        
    } else if (state === 'game-over') {

    }
}

function handleClick(e) {
    if (state !== 'game-started') {
        return;
    }

    const mouse = {
        x: e.offsetX,
        y: e.offsetY
    };

    for (let i = 0; i < bonuses.length; ++i) {
        const bonus = bonuses[i];
        if (testHit(mouse, bonus, bonusRadius)) {
            bonuses = bonuses.filter(b => b !== bonus);
            gameOverTime_msecs += bonusExtension_secs * 1000;
            return;
        }
    }

    if (testHit(mouse, chicken, chickenRadius)) {
        ++score;
        layEgg();
        moveChicken();
    }
}

function testHit(mouse, object, radius) {
    const dx = object.x - mouse.x;
    const dy = object.y - mouse.y;
    return dx * dx + dy * dy < radius * radius;
}

function newGameButtonClicked(e) {
    const newGamePanel = document.querySelector('#new-game');
    newGamePanel.style.visibility = 'hidden';

    state = 'game-started';
    score = 0;
    startTime_msecs = Date.now();
    gameOverTime_msecs = initGameOverTime_secs * 1000;
    eggs = [];
    bonuses = [];
    nextBonus_msecs = startTime_msecs + bonusFreq_secs * 1000;
    moveChicken();
}

function moveChicken() {
    chicken.x = Math.floor(random(chickenRadius, canvas.width - chickenRadius));
    chicken.y = Math.floor(random(chickenRadius, canvas.height - chickenRadius));
}

function layEgg() {
    const egg = {
        x: chicken.x,
        y: chicken.y
    }
    eggs.push(egg);
}

function updateBonuses(elapsed_msecs) {
    bonuses = bonuses.filter(b => b.expire_msecs > startTime_msecs + elapsed_msecs);
    if (nextBonus_msecs <= startTime_msecs + elapsed_msecs) {
        const bonus = {
            x: Math.floor(random(bonusRadius, canvas.width - bonusRadius)),
            y: Math.floor(random(bonusRadius, canvas.height - bonusRadius)),
            expire_msecs: startTime_msecs + elapsed_msecs + bonusExpire_secs * 1000
        }
        bonuses.push(bonus);
        nextBonus_msecs += bonusFreq_secs * 1000;
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

init();
start();