let song;
let amplitude;

let cx, cy;

let baseSize = 180;
let currentSize = 180;
let targetSize = 180;

let started = false;

function preload() {
  // 按你的真实文件名改
  song = loadSound("sounds:another-day-of-sun.mp3.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;

  amplitude = new p5.Amplitude();
  amplitude.smooth(0.9);

  noStroke();
}

function draw() {
  background(15, 15, 18);

  cx = width / 2;
  cy = height / 2;

  // 没播放时，完全静止
  if (!song.isPlaying()) {
    drawCircle(baseSize);
    return;
  }

  let level = amplitude.getLevel();

  // 很简单的呼吸映射
  targetSize = map(level, 0, 0.2, 180, 300, true);

  // 缓动，让变化更柔和
  currentSize += (targetSize - currentSize) * 0.08;

  drawCircle(currentSize);
}

function drawCircle(size) {
  // 外层淡光
  fill(255, 235, 210, 35);
  ellipse(cx, cy, size * 1.35);

  // 主圆
  fill(255, 240, 220, 230);
  ellipse(cx, cy, size);

  // 小高光
  fill(255, 255, 255, 40);
  ellipse(cx - size * 0.14, cy - size * 0.14, size * 0.2);
}

function mousePressed() {
  startExperience();
}

function keyPressed() {
  if (key === " ") {
    startExperience();
    return false;
  }
}

function startExperience() {
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
  cx = width / 2;
  cy = height / 2;
}
