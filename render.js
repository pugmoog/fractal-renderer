function render() {
  let limit = maxOverflow * maxOverflow;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelNum = i / 4;
    const x = pixelNum % canvas.width;
    const y = Math.floor(pixelNum / canvas.width);

    let pixelX = x / zoom + scroll_x;
    let pixelY = y / zoom + scroll_y;

    console.log("Evaluating start equation:", eval(startEquation));

    let j;
    let zx_new = 0;
    let zy_new = 0;
    for (j = 0; j < max_depth && zx * zx + zy * zy < limit; j += 1) {
      eval(equation);
      zx = zx_new;
      zy = zy_new;
    }

    if (zx * zx + zy * zy > limit) {
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
