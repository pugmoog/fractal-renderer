var scroll_x = -2.3;
var scroll_y = -1.5;
var zoom = 50;

var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

var max_depth = 100;
var colorIntensity = 2;
var colorDelay = 0;
var colorFade = 100;
var resolution = 50;
var screenSize = 50;
var maxOverflow = 2;
var equation = "zx_new = zx * zx - zy * zy + cx; zy_new = 2 * zx * zy + cy;"
var startEquation = "var cx = pixelX; var cy = pixelY; var zx = 0; var zy = 0;"
var palette;

var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

updateSettings();

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  lastMouseX = e.offsetX;
  lastMouseY = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
});

canvas.addEventListener("mouseleave", (e) => {
  mouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let dx = lastMouseX - e.offsetX;
    let dy = lastMouseY - e.offsetY;

    dx *= canvas.width / canvas.clientWidth;
    dy *= canvas.height / canvas.clientHeight;

    scroll_x += dx / zoom;
    scroll_y += dy / zoom;

    lastMouseX = e.offsetX;
    lastMouseY = e.offsetY;

    render();
  }
});

function zoomIn() {
  screenx = canvas.width / 2;
  screeny = canvas.width / 2;
  oldworldx = scroll_x + screenx / zoom;
  oldworldy = scroll_y + screeny / zoom;
  zoom *= 1.2;
  scroll_x = oldworldx - screenx / zoom;
  scroll_y = oldworldy - screeny / zoom;

  render();
}

function zoomOut() {
  screenx = canvas.width / 2;
  screeny = canvas.width / 2;
  oldworldx = scroll_x + screenx / zoom;
  oldworldy = scroll_y + screeny / zoom;
  zoom /= 1.2;
  scroll_x = oldworldx - screenx / zoom;
  scroll_y = oldworldy - screeny / zoom;

  render();
}

function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r1, g1, b1;
  if (h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function updateSettings() {
  zoom /= resolution / Math.round(Number(document.getElementById("resolution-input").value) / 2);
  resolution = Math.round(Number(document.getElementById("resolution-input").value) / 2);
  max_depth = Number(document.getElementById("depth-input").value);
  colorIntensity = Number(document.getElementById("color-int-input").value) / 50;
  screenSize = Number(document.getElementById("screen-size-input").value) * 4;
  colorDelay = Number(document.getElementById("color-delay-input").value);
  colorFade = Number(document.getElementById("color-fade-input").value);
  maxOverflow = Number(document.getElementById("max-overflow-input").value);
  equation = document.getElementById("equation-input").value;
  startEquation = document.getElementById("start-input").value;

  canvas.style.width = String(screenSize) + "px";
  canvas.style.height = String(screenSize * 0.75) + "px";

  canvas.width = (canvas.clientWidth * resolution) / 100;
  canvas.height = (canvas.clientHeight * resolution) / 100;

  palette = new Uint8Array(max_depth * 3 + 1);
  for (let i = 0; i < max_depth; i++) {
    const rgb = hsvToRgb(colorDelay + (i * colorIntensity), 1, Math.min(1, (i * 8/colorFade)));
    palette[i * 3] = rgb[0];
    palette[i * 3 + 1] = rgb[1];
    palette[i * 3 + 2] = rgb[2];
  }
  render();
}
