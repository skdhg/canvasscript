const { createCanvas } = require("../lib/Canvas");

const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#f2a5aa";
ctx.fillRect(0, 0, 100, 100);

ctx.strokeStyle = "#ff4444";
ctx.strokeRect(0, 0, 100, 100);


require("fs").writeFileSync(`${__dirname}/hello.png`, canvas.encodeSync("png"))