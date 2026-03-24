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
  background(15);

  let cx = width / 2;
  let cy = height / 2;
  
  if (!song.isPlaying()) {
    drawCircle(cx, cy, 180);
    return;
  }

  let level = amplitude.getLevel();

  targetSize = map(level, 0, 0.2, 180, 260, true);

  size += (targetSize - size) * 0.1;

  drawCircle(cx, cy, size);
}

function drawCircle(x, y, s) {
  fill(255, 230, 200, 40);
  ellipse(x, y, s * 1.4);

  fill(255, 240, 220);
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
