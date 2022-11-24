const { Transformer } = require("@napi-rs/image");
const Canvas = require("../lib/index");

const canvas = Canvas.createCanvas(512, 512);
const ctx = canvas.getContext("2d");

for (let i = 0; i < 8; i++) {
    ctx.fillStyle = Canvas.getRandomColor();
    ctx.fillRect(i * 64, 0, 64, canvas.height);
}

require("fs").writeFileSync(`${__dirname}/hello.png`, canvas.encodeSync("png"))