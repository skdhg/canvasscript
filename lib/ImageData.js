class ImageData {
    #width;
    #height;
    #data;
    constructor(dataOrWidth, widthOrHeight, height) {
        if (typeof dataOrWidth === "number") {
            this.#width = dataOrWidth;
            this.#height = dataOrWidth ?? widthOrHeight;
        } else if (dataOrWidth instanceof Object.getPrototypeOf(Uint8Array)) {
            this.#data = dataOrWidth;
            this.#width = widthOrHeight;
            this.height = height ?? widthOrHeight;
        }
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get data() {
        return this.#data;
    }
}
