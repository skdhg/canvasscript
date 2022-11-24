import { CanvasRenderingContext2D as NativeContext } from "./binding";
import { ImageData } from "./ImageData";

export type CanvasEncoding = "png" | "jpg" | "jpeg" | "pnm" | "raw" | "webp" | "ico" | "bmp" | "avif";

class CanvasRenderingContext2D extends NativeContext {
    public getImageData(x: number, y: number, w?: number, h?: number): ImageData;
    private __rq_surface_get_img_data_u8(): Buffer;
}

export class Canvas {
    public constructor(public readonly width: number, readonly height: number);

    public getContext(ctxType: "2d"): CanvasRenderingContext2D;
    public getContext(ctxType: string): CanvasRenderingContext2D | null;

    public toBuffer(encoding?: `image/${CanvasEncoding}`): Buffer;
    public toBufferAsync(encoding?: `image/${CanvasEncoding}`): Promise<Buffer>;

    public encodeSync(encoding?: CanvasEncoding): Buffer;
    public encode(encoding?: CanvasEncoding): Promise<Buffer>;
}

export function createCanvas(width: number, height: number): Canvas;
export function getRandomColor(): `#${string}`;