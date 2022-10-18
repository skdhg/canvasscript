const test = require("ava");
const { createCanvas, Canvas } = require("../index.js");
const { writeFileSync } = require("fs");

test("Should create canvas", (t) => {
    t.is(createCanvas(10, 10) instanceof Canvas, true);
});

test("Should create context", (t) => {
    const canvas = createCanvas(10, 10);
    const ctx = canvas.getContext("2d");

    t.is(ctx.canvas, canvas);
});

test("Should draw rectangle", (t) => {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    const colors = ["red", "green", "blue", "orange", "pink", "cyan", "brown", "gold"];

    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(i * 64, 0, 64, canvas.height);
    }

    const buffer = canvas.toBuffer("image/png");
    writeFileSync(`${__dirname}/images/draw_rect.png`, buffer);

    t.is(Buffer.isBuffer(buffer), true);
});
