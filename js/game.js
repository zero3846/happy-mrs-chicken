export class Game {
    #state;
    #width;
    #height;

    constructor() {
        this.#state = 'home';
        this.#width = 0;
        this.#height = 0;
    }

    startGame() {
        this.#state = 'game-started';
    }

    endGame() {
        this.#state = 'game-over';
    }

    isGameStarted() {
        return this.#state === 'game-started';
    }

    isGameOver() {
        return this.#state === 'game-over';
    }

    load() {
        const canvas = document.querySelector('#canvas');
        this.#width = canvas.width;
        this.#height = canvas.height;
    }

    update() {}

    draw(ctx) {
        ctx.clearRect(0, 0, this.#width, this.#height);
        if (this.isGameStarted()) {
            this.drawGame(ctx);
        } else if (this.isGameOver()) {
            this.drawGameOver(ctx);
        }
    }

    drawGame(ctx) {}

    drawGameOver(ctx) {}

    click(e) {}
}