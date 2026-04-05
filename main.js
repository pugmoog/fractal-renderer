let scroll_x = -2.3;
let scroll_y = -1.5;
let zoom = 50;

let canvas = document.getElementById("display");
let ctx = canvas.getContext("2d");

let max_depth = 100;
let colorIntensity = 2;
let colorDelay = 0;
let colorFade = 100;
let resolution = 50;
let screenSize = 50;
const style = getComputedStyle(canvas);
const resolutionInput = document.getElementById("resolution-input");
const depthInput = document.getElementById("depth-input");
const colorIntInput = document.getElementById("color-int-input");
const screenSizeInput = document.getElementById("screen-size-input");
const colorDelayInput = document.getElementById("color-delay-input");
const colorFadeInput = document.getElementById("color-fade-input");

let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

let palette;

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
  zoom /= resolution / Math.round(Number(resolutionInput.value) / 2);
  resolution = Math.round(Number(resolutionInput.value) / 2);
  max_depth = Number(depthInput.value);
  colorIntensity = Number(colorIntInput.value) / 50;
  screenSize = Number(screenSizeInput.value) * 4;
  colorDelay = Number(colorDelayInput.value);
  colorFade = Number(colorFadeInput.value);

  canvas.style.width = String(screenSize) + "px";
  canvas.style.height = String(screenSize * 0.75) + "px";

  canvas.width = (canvas.clientWidth * resolution) / 100;
  canvas.height = (canvas.clientHeight * resolution) / 100;

  palette = new Uint8Array(max_depth * 3 + 1);
  for (let i = 0; i < max_depth; i++) {
    const rgb = hsvToRgb(i * colorIntensity, 1, (i * colorIntensity) / 30);
    palette[i * 3] = rgb[0];
    palette[i * 3 + 1] = rgb[1];
    palette[i * 3 + 2] = rgb[2];
  }
  render();
}
