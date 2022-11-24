const { createCanvas } = require("../lib/Canvas");

const canvas = createCanvas(100, 100);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#7289da";
ctx.fillRect(0, 0, 100, 100);

ctx.strokeStyle = "#f8e354";
ctx.strokeRect(0, 0, 100, 100);

require("fs").writeFileSync("./hello.png", canvas.encodeSync("png"))