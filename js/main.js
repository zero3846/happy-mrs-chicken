let canvas;
let ctx;

const initGameOverTime_secs = 15;
const chickenRadius = 50;
const eggRadius = 30;
const bonusRadius = 30;
const bonusFreq_secs = 5;
const bonusExpire_secs = 3;

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
    canvas = document.querySelector('#canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('click', handleClick);

    ctx = canvas.getContext('2d');

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
    ctx.beginPath();
    ctx.arc(chicken.x, chicken.y, chickenRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawEgg(egg) {
    ctx.beginPath();
    ctx.arc(egg.x, egg.y, eggRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'lightgoldenrodyellow';
    ctx.fill();
    ctx.closePath();
}

function drawBonus(bonus) {
    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, bonusRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'darkred';
    ctx.fill();
    ctx.closePath();
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

    ++score;
    layEgg();
    moveChicken();
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