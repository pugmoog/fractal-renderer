var zx;var zy;var cx; var cy; var pixelX;var pixelY;var zx_new;var zy_new;
function render() {
  let executeStartEquation = new Function("pixelX", "pixelY", "return {"+startEquation+"};");
  let executeEquation = new Function("zx", "zy", "cx", "cy", "return {"+equation+"};");
  
  let limit = maxOverflow * maxOverflow;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelNum = i / 4;
    const x = pixelNum % canvas.width;
    const y = Math.floor(pixelNum / canvas.width);

    pixelX = x / zoom + scroll_x;
    pixelY = y / zoom + scroll_y;

    zx = 0; zy=0; cx=0; cy=0;
    const start = executeStartEquation(pixelX, pixelY);
    zx = start.zx;
    zy = start.zy;
    cx = start.cx;
    cy = start.cy;
    
    let j;
    zx_new = 0;
    zy_new = 0;
    for (j = 0; j < max_depth && zx * zx + zy * zy < limit; j += 1) {
      const next = executeEquation(zx,zy,cx,cy);
      zx = next.zx_new;
      zy = next.zy_new;
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
