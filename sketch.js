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

  // 没播放 → 完全静止
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

// 🌌 蓝紫渐变背景
function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let t = y / height;

    let r = lerp(10, 40, t);
    let g = lerp(10, 20, t);
    let b = lerp(40, 90, t);

    stroke(r, g, b);
    line(0, y, width, y);
  }
}

// 🫁 呼吸球（蓝紫）
function drawCircle(x, y, s) {
  let t = map(s, 180, 260, 0, 1);

  // 蓝 → 紫
  let r = lerp(100, 180, t);
  let g = lerp(120, 80, t);
  let b = lerp(255, 255, t);

  // 外层 glow
  fill(r, g, b, 30);
  ellipse(x, y, s * 1.6);

  // 中层 glow
  fill(r, g, b, 80);
  ellipse(x, y, s * 1.3);

  // 核心
  fill(r, g, b, 200);
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
