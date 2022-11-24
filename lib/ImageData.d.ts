export class ImageData {
    public constructor();
    public constructor(width: number, height?: number);
    public constructor(data: Uint8ClampedArray | Buffer, width: number, height?: number);

    public get width(): number;
    public get height(): number;
    public get data(): Uint8ClampedArray;
}