class CanvasRenderingContext2D {
    /**
     * @type {import("./binding").DrawContext}
     */
    #context;
    constructor(canvas, dt) {
        /**
         * @type {import("../index").Canvas}
         */
        this.canvas = canvas;
        this.#context = dt;
    }

    get fillStyle() {
        return this.#context.fillStyle;
    }

    set fillStyle(style) {
        this.#context.fillStyle = style;
    }

    get strokeStyle() {
        return this.#context.strokeStyle;
    }

    set strokeStyle(style) {
        this.#context.strokeStyle = style;
    }

    fillRect(x, y, width, height) {
        return this.#context.fillRect(x, y, width, height);
    }

    strokeRect(x, y, width, height) {
        return this.#context.strokeRect(x, y, width, height);
    }
}

module.exports = {
    CanvasRenderingContext2D
};
