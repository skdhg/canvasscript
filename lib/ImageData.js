class ImageData {
    constructor(dataOrWidth, widthOrHeight, height) {
        if (typeof dataOrWidth === "number") {
            this.#define("data", new Uint8ClampedArray());
            this.#define("width", dataOrWidth);
            this.#define("height", dataOrWidth ?? widthOrHeight);
        } else if (Buffer.isBuffer(dataOrWidth) || dataOrWidth instanceof Object.getPrototypeOf(Uint8Array)) {
            const data = dataOrWidth instanceof Uint8ClampedArray ? dataOrWidth : new Uint8ClampedArray(dataOrWidth);
            this.#define("data", data);
            this.#define("width", widthOrHeight);
            this.#define("height", height ?? widthOrHeight);
        }
    }

    #define(p, v) {
        Object.defineProperty(this, p, {
            value: v,
            enumerable: true,
            configurable: false,
            writable: false
        });
    }
}

module.exports.ImageData = ImageData;