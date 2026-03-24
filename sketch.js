let song;
let amplitude;

let size = 180;
let targetSize = 180;

let started = false;

function preload() {
  song = loadSound("another-day-of-sun.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
  noStroke();
}

function draw() {
  drawGradientBackground();

  let cx = width / 2;
  let cy = height / 2;

  // 没播放时完全静止
  if (!song.isPlaying()) {
    drawCircle(cx, cy, 180);
    return;
  }

  let level = amplitude.getLevel();

  // 呼吸大小
  targetSize = map(level, 0, 0.2, 180, 260, true);
  size += (targetSize - size) * 0.1;

  drawCircle(cx, cy, size);
}

function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let t = y / height;

    // 很明显的深蓝 -> 紫色
    let r = lerp(20, 90, t);
    let g = lerp(10, 30, t);
    let b = lerp(90, 180, t);

    stroke(r, g, b);
    line(0, y, width, y);
  }
}

function drawCircle(x, y, s) {
  let t = map(s, 180, 260, 0, 1, true);

  // 明显的蓝 -> 紫
  let r = lerp(80, 180, t);
  let g = lerp(120, 80, t);
  let b = lerp(255, 255, t);

  // 外层大光晕
  fill(r, g, b, 35);
  ellipse(x, y, s * 1.9);

  // 中层光晕
  fill(r, g, b, 80);
  ellipse(x, y, s * 1.45);

  // 核心圆
  fill(r, g, b, 220);
  ellipse(x, y, s);
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    document.getElementById("splash").classList.add("hidden");
    started = true;
  }

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
