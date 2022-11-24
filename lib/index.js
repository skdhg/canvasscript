const { CanvasRenderingContext2D } = require("./binding");
const { Transformer } = require("@napi-rs/image");
const { ImageData } = require("./ImageData");

class Canvas {
    /**
     * @type {CanvasRenderingContext2D}
     */
    #context;
    /**
     * @type {number}
     */
    #width;
    /**
     * @type {number}
     */
    #height;
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
    }

    #createContext() {
        const ctx = new CanvasRenderingContext2D(this.#width, this.#height);

        Object.defineProperty(ctx, "canvas", {
            get: () => {
                return this;
            }
        });

        Object.defineProperty(ctx, "getImageData", {
            value: (x, y, w, h) => {
                w ??= this.width;
                h ??= this.height;
                
                if (typeof x !== "number") throw new TypeError(`Expected x to be a number, got ${typeof x}`);
                if (typeof y !== "number") throw new TypeError(`Expected y to be a number, got ${typeof y}`);
                
                const pixels = ctx.__rq_surface_get_img_data_u8();

                const transformer = Transformer.fromRgbaPixels(pixels, this.width, this.height);

                const data = transformer.crop(x, y, w, h).rawPixelsSync();

                return new ImageData(data, w, h);
            }
        });

        return ctx;
    }

    get width() {
        return this.#context.width ?? this.#width;
    }

    get height() {
        return this.#context.height ?? this.#height;
    }

    getContext(ctx) {
        if (ctx !== "2d") return null;
        if (!this.#context) this.#context = this.#createContext();
        return this.#context;
    }

    encode(format = "png", options = {}) {
        return this.toBufferAsync(`image/${format}`, options);
    }

    encodeSync(format = "png", options = {}) {
        return this.toBuffer(`image/${format}`, options);
    }

    toBuffer(format = "image/png", options = {}) {
        if (format === "image/jpg") format = "image/jpeg";

        switch (format) {
            case "image/png":
            case "image/pnm":
            case "image/avif":
            case "image/jpeg":
            case "image/webp":
            case "image/ico":
            case "image/raw":
            case "image/bmp": {
                format = format.replace("image/", "");
                const rawBuffer = this.#context.__rq_surface_get_img_data_u8();
                if (format === "raw") return rawBuffer;
                const transformer = Transformer.fromRgbaPixels(rawBuffer, this.width, this.height);
                if ((format === "jpeg" || format === "webp") && typeof options.quality === "number") return transformer[`${format}Sync`](options.quality);
                if ((format === "png" || format === "avif") && typeof options.quality === "number") return transformer[`${format}Sync`](options);
                return transformer[`${format}Sync`]();
            }
            default: {
                throw new TypeError(`"${format}" encoding is not supported`);
            }
        }
    }

    toBufferAsync(format = "image/png", options = {}) {
        if (format === "image/jpg") format = "image/jpeg";

        switch (format) {
            case "image/png":
            case "image/pnm":
            case "image/avif":
            case "image/jpeg":
            case "image/webp":
            case "image/ico":
            case "image/raw":
            case "image/bmp": {
                format = format.replace("image/", "");
                const rawBuffer = this.#context.__rq_surface_get_img_data_u8();
                if (format === "raw") return rawBuffer;
                const transformer = Transformer.fromRgbaPixels(rawBuffer, this.width, this.height);
                if ((format === "jpeg" || format === "webp") && typeof options.quality === "number") return transformer[format](options.quality);
                if ((format === "png" || format === "avif") && typeof options.quality === "number") return transformer[format](options);
                return transformer[format]();
            }
            default: {
                throw new TypeError(`"${format}" encoding is not supported`);
            }
        }
    }
}

module.exports.Canvas = Canvas;
module.exports.createCanvas = function (width, height) {
    return new Canvas(width, height);
};
module.exports.getRandomColor = function() {
    const color = Math.floor(Math.random() * 0xFFFFFF + 1);

    return `#${color.toString(16).toUpperCase()}`;
}