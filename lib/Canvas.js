const { JSDrawTarget } = require("./binding");
const { CanvasRenderingContext2D } = require("./CanvasRenderingContext2D");
const { Transformer } = require("@napi-rs/image");

class Canvas {
    #dt;
    constructor(width, height) {
        this.#dt = new JSDrawTarget(width, height);
    }

    get width() {
        return this.#dt.width;
    }

    get height() {
        return this.#dt.height;
    }

    getContext(ctx) {
        if (ctx !== "2d") return null;
        return new CanvasRenderingContext2D(this, this.#dt);
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
            case "image/bmp": {
                format = format.replace("image/", "");
                const rawBuffer = Buffer.from(this.#dt.getBuffer());
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
                const rawBuffer = Buffer.from(this.#dt.getBuffer());
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

module.exports = {
    Canvas,
    createCanvas: function (width, height) {
        return new Canvas(width, height);
    }
};
