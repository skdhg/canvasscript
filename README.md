# CanvasScript

Super simple canvas implementation for node using [raqote](https://crates.io/crates/raqote).

> 🚧 This project is a work in progress.

# Installation

```sh
$ npm install canvasscript
```

# Example

```js
const { createCanvas } = require('canvasscript');
const fs = require('fs');

const canvas = createCanvas(500, 300);
const ctx = canvas.getContext('2d');

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext("2d");

const colors = [
    'red', 'green',
    'blue', 'orange',
    'pink', 'cyan',
    'brown', 'gold'
];

for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(i * 64, 0, 64, canvas.height);
}

fs.writeFileSync('image.png', canvas.toBuffer('image/png'));
```

# Inspirations

- [@napi-rs/canvas](https://github.com/brooooooklyn/canvas)
