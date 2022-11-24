const { CanvasRenderingContext2D } = require("./binding");
const { Transformer } = require("@napi-rs/image");

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
            // TODO
            value: () => {
                return new ImageData(ctx.__rq_surface_get_img_data_u8(), this.width, this.height);
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
