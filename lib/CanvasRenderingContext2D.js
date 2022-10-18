class CanvasRenderingContext2D {
    /**
     * @type {import("./binding").JSDrawTarget}
     */
    #dt;
    constructor(canvas, dt) {
        /**
         * @type {import("../index").Canvas}
         */
        this.canvas = canvas;
        this.#dt = dt;
        this.fillStyle = "#000000";
        this.strokeStyle = "#000000";
    }

    fillRect(x, y, width, height) {
        return this.#dt.fillRect(x, y, width, height, this.fillStyle);
    }
}

module.exports = {
    CanvasRenderingContext2D
};
