function render() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelNum = i / 4;
    const x = pixelNum % canvas.width;
    const y = Math.floor(pixelNum / canvas.width);

    let cx = x / zoom + scroll_x;
    let cy = y / zoom + scroll_y;
    let zx = 0;
    let zy = 0;

    let j;
    for (j = 0; j < max_depth && zx * zx + zy * zy < 4; j += 1) {
      zx_new = zx * zx - zy * zy + cx;
      zy_new = 2 * zx * zy + cy;
      zx = zx_new;
      zy = zy_new;
    }

    if (zx * zx + zy * zy > 4) {
      setColor(data, i, palette[j * 3], palette[j * 3 + 1], palette[j * 3 + 2], 255);
    } else {
      setColor(data, i, 0, 0, 0, 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function setColor(data, i, r, g, b, a) {
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}
