import { HappyMrsChickenGame } from "./happy-mrs-chicken.js";

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

const canvas = document.querySelector('#canvas');
canvas.width = contentElem.clientWidth;
canvas.height = contentElem.clientHeight;
canvas.addEventListener('click', handleClick);

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const game = new HappyMrsChickenGame();
game.load();

window.requestAnimationFrame(animate);

function animate() {
    game.update();
    game.draw(ctx);
    window.requestAnimationFrame(animate);
}

function handleClick(e) {
    game.click(e);
}