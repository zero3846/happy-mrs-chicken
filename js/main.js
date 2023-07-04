const canvas = content.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let state = "new-game";
let score = 0;
let timeLeft = 0;
const chicken = {
    x: 0,
    y: 0
};
const eggs = [];
const bonuses = [];

function init() {
    const canvas = content.querySelector('#canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('click', handleClick);
}

function animate(now) {
    draw();
    window.requestAnimationFrame(animate);
}

function start() {
    window.requestAnimationFrame(animate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleClick(e) {
    console.log('Clicked');
}

init();
start();