# CanvasScript

Super simple canvas implementation for node using [raqote](https://crates.io/crates/raqote).

> 🚧 This project is a work in progress.

# Installation

```sh
$ npm install canvasscript
```

# Example

```js
const { createCanvas, getRandomColor } = require('canvasscript');
const fs = require('fs');

const canvas = createCanvas(500, 300);
const ctx = canvas.getContext('2d');

for (let i = 0; i < 8; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(i * 64, 0, 64, canvas.height);
}

fs.writeFileSync('image.png', canvas.toBuffer('image/png'));
```

### Output Preview

![preview](https://raw.githubusercontent.com/archaeopteryx1/canvasscript/main/__test__/images/draw_rect.png)

# Inspirations

- [@napi-rs/canvas](https://github.com/brooooooklyn/canvas)
