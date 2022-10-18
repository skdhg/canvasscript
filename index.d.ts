import { AvifConfig, PngEncodeOptions } from "@napi-rs/image";

export type CanvasExportEncoding = "png" | "pnm" | "jpg" | "jpeg" | "webp" | "avif" | "bmp" | "ico" | "raw";

type EncodeOptionsFor<T> = T extends "png"
    ? PngEncodeOptions
    : T extends "avif"
    ? AvifConfig
    : {
          quality?: number;
      };

export class Canvas {
    public constructor(width: number, height: number);

    public get width(): number;
    public get height(): number;

    public getContext(ctx: "2d"): CanvasRenderingContext2D;
    public getContext(): null;
    public getContext(ctx?: "2d"): CanvasRenderingContext2D | null;

    public encodeSync<T extends CanvasExportEncoding>(encoding?: T, options?: EncodeOptionsFor<T>): Buffer;
    public encode<T extends CanvasExportEncoding>(encoding?: T, options?: EncodeOptionsFor<T>): Promise<Buffer>;

    public toBuffer<T extends CanvasExportEncoding>(encoding?: `image/${T}`, options?: EncodeOptionsFor<T>): Buffer;
    public toBufferAsync<T extends CanvasExportEncoding>(encoding?: `image/${T}`, options?: EncodeOptionsFor<T>): Promise<Buffer>;
}

class CanvasRenderingContext2D {
    public get canvas(): Canvas;

    public fillStyle: string;
    public strokeStyle: string;

    public fillRect(x: number, y: number, width: number, height: number): void;
}

export function createCanvas(width: number, height: number): Canvas;
