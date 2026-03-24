let song;
let fft;
let amplitude;
let peakDetect;

// 画面中心
let cx, cy;

// 呼吸圆大小
let currentSize = 180;
let targetSize = 180;

// 光晕
let glowSize = 260;
let targetGlowSize = 260;

// 节拍冲击
let pulseBoost = 0;

// 背景闪白
let flashAlpha = 0;

// 环形线条
let ringBase = 260;

// 页面是否开始
let started = false;

function preload() {
  // 这里改成你自己的音频文件名
  song = loadSound("another-day-of-sun.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;

  fft = new p5.FFT(0.85, 1024);
  amplitude = new p5.Amplitude();
  amplitude.smooth(0.9);

  peakDetect = new p5.PeakDetect(20, 200, 0.18, 20);

  noStroke();
}

function draw() {
  cx = width / 2;
  cy = height / 2;

  // 半透明背景，制造拖影感
  background(15, 15, 18, 38);

  let level = amplitude.getLevel();
  let spectrum = fft.analyze();
  peakDetect.update(fft);

  // 低频 / 高频
  let bass = fft.getEnergy("bass");
  let highMid = fft.getEnergy("highMid");
  let treble = fft.getEnergy("treble");

  // 把音量映射到呼吸大小
  // level 常常很小，所以范围不要写太大
  let mappedBreath = map(level, 0, 0.22, 170, 320, true);

  // 低频越强，整体越厚重
  let bassInfluence = map(bass, 0, 255, 0, 55, true);

  targetSize = mappedBreath + bassInfluence;

  // 节拍触发时，像呼吸被突然打断
  if (peakDetect.isDetected) {
    pulseBoost = 42;
    flashAlpha = 42;
  }

  // 让 boost 慢慢衰减
  pulseBoost *= 0.88;
  flashAlpha *= 0.86;

  // 当前大小缓动到目标大小
  let breatheSpeed = map(level, 0, 0.22, 0.035, 0.12, true);
  currentSize += (targetSize + pulseBoost - currentSize) * breatheSpeed;

  targetGlowSize = currentSize * 1.55;
  glowSize += (targetGlowSize - glowSize) * 0.08;

  // ===== 背景呼吸环 =====
  drawBreathingRings(level, bass, highMid, treble);

  // ===== 外围微粒 =====
  drawDust(level, treble);

  // ===== 主体 glow =====
  drawGlow(level);

  // ===== 主体核心圆 =====
  drawCore(level);

  // ===== 闪白层 =====
  if (flashAlpha > 0.5) {
    fill(255, flashAlpha);
    rect(0, 0, width, height);
  }

  // ===== DOM 文本更新 =====
  updateHUD(level, bass);
}

function drawBreathingRings(level, bass, highMid, treble) {
  push();
  noFill();

  let ringCount = 4;

  for (let i = 0; i < ringCount; i++) {
    let ratio = i / ringCount;

    let ringSize =
      ringBase +
      i * 65 +
      currentSize * 0.35 +
      sin(frameCount * 0.02 + i * 0.9) * 10;

    let alpha = map(level, 0, 0.22, 18, 52, true) - i * 6;
    alpha = max(alpha, 8);

    let strokeWeightValue = map(bass, 0, 255, 0.8, 2.2, true) - i * 0.2;
    strokeWeightValue = max(strokeWeightValue, 0.6);

    stroke(
      255 - i * 10,
      235 - i * 8,
      220 - i * 6,
      alpha
    );
    strokeWeight(strokeWeightValue);

    let wobbleX = map(highMid, 0, 255, 0, 18 + i * 3, true);
    let wobbleY = map(treble, 0, 255, 0, 10 + i * 2, true);

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.08) {
      let noiseWave =
        sin(a * 3 + frameCount * 0.015 + i) * wobbleX +
        cos(a * 5 - frameCount * 0.02 - i) * wobbleY;

      let r = ringSize + noiseWave;
      let x = cx + cos(a) * r;
      let y = cy + sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  pop();
}

function drawDust(level, treble) {
  push();

  let particleCount = 26;
  let spread = currentSize * 1.25;

  for (let i = 0; i < particleCount; i++) {
    let angle = map(i, 0, particleCount, 0, TWO_PI);
    let offset =
      sin(frameCount * 0.01 + i * 2.3) * 25 +
      map(treble, 0, 255, 6, 30, true);

    let x = cx + cos(angle + frameCount * 0.002) * (spread + offset);
    let y = cy + sin(angle + frameCount * 0.002) * (spread + offset);

    let d = map(level, 0, 0.22, 2, 7, true);
    fill(255, 210, 190, 32);
    ellipse(x, y, d, d);
  }

  pop();
}

function drawGlow(level) {
  push();

  let outerAlpha = map(level, 0, 0.22, 18, 42, true);
  let midAlpha = map(level, 0, 0.22, 26, 70, true);

  fill(255, 220, 180, outerAlpha);
  ellipse(cx, cy, glowSize * 1.28, glowSize * 1.28);

  fill(255, 236, 210, midAlpha);
  ellipse(cx, cy, glowSize, glowSize);

  pop();
}

function drawCore(level) {
  push();

  let warmR = map(level, 0, 0.22, 228, 255, true);
  let warmG = map(level, 0, 0.22, 224, 242, true);
  let warmB = map(level, 0, 0.22, 215, 190, true);

  fill(warmR, warmG, warmB, 235);
  ellipse(cx, cy, currentSize, currentSize);

  fill(255, 255, 255, 45);
  ellipse(cx - currentSize * 0.14, cy - currentSize * 0.14, currentSize * 0.22);

  pop();
}

function updateHUD(level, bass) {
  let stateText = document.getElementById("stateText");
  let levelText = document.getElementById("levelText");

  let breathValue = floor(map(level, 0, 0.22, 0, 100, true));

  if (level < 0.04) {
    stateText.textContent = "calm";
  } else if (level < 0.09) {
    stateText.textContent = "steady";
  } else if (level < 0.15) {
    stateText.textContent = "unstable";
  } else {
    stateText.textContent = "overwhelmed";
  }

  levelText.textContent = "breath " + breathValue;
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

    let splash = document.getElementById("splash");
    let hud = document.getElementById("hud");

    splash.classList.add("hidden");
    hud.classList.add("visible");

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