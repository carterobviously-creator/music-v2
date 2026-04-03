/* ============================================
   MAXIMUS V2 — CORE REACTOR LOGIC (MODULE 3)
   ============================================ */

// DOM references
const logEl = document.getElementById("log");
const progressFill = document.getElementById("progressFill");
const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const lengthInput = document.getElementById("lengthInput");
const waveformCanvas = document.getElementById("waveformCanvas");
const ctx = waveformCanvas.getContext("2d");

// Resize canvas properly
function resizeWaveform() {
  waveformCanvas.width = waveformCanvas.clientWidth;
  waveformCanvas.height = waveformCanvas.clientHeight;
}
resizeWaveform();
window.addEventListener("resize", resizeWaveform);

// ------------------------------
// LOGGING SYSTEM
// ------------------------------
function mv2Log(msg) {
  logEl.textContent += msg + "\n";
  logEl.scrollTop = logEl.scrollHeight;
}

// ------------------------------
// PROGRESS BAR CONTROL
// ------------------------------
function setProgress(pct) {
  progressFill.style.width = pct + "%";
}

// ------------------------------
// WAVEFORM DRAWING (placeholder)
// ------------------------------
function drawWaveform(samples) {
  ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

  ctx.strokeStyle = "#00eaff";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const step = samples.length / waveformCanvas.width;
  const mid = waveformCanvas.height / 2;

  for (let i = 0; i < waveformCanvas.width; i++) {
    const sample = samples[Math.floor(i * step)] || 0;
    const y = mid + sample * mid;
    if (i === 0) ctx.moveTo(i, y);
    else ctx.lineTo(i, y);
  }

  ctx.stroke();
}

// ------------------------------
// REACTOR HUM AUDIO NODE
// ------------------------------
let audioCtx = null;
let humOsc = null;
let humGain = null;

function startHum() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  humOsc = audioCtx.createOscillator();
  humGain = audioCtx.createGain();

  humOsc.type = "sine";
  humOsc.frequency.value = 40; // low reactor rumble
  humGain.gain.value = 0.0001;

  humOsc.connect(humGain).connect(audioCtx.destination);
  humOsc.start();

  // fade in
  humGain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 1);
}

function stopHum() {
  if (!humGain || !humOsc) return;

  humGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
  setTimeout(() => {
    humOsc.stop();
    humOsc.disconnect();
    humOsc = null;
  }, 1200);
}

// ------------------------------
// PLACEHOLDER: MODEL LOADING
// ------------------------------
async function loadModel() {
  mv2Log("Loading model (Module 4 will add real logic)...");
  return true;
}

// ------------------------------
// PLACEHOLDER: GENERATION ENGINE
// ------------------------------
async function generateAudio(prompt, lengthSec) {
  mv2Log("Generation engine placeholder (Module 4 adds real model).");

  // Fake progress for now
  for (let i = 0; i <= 100; i += 5) {
    setProgress(i);
    await new Promise(r => setTimeout(r, 30));
  }

  // Fake waveform
  const fake = new Array(2048).fill(0).map(() => Math.random() * 2 - 1);
  drawWaveform(fake);

  mv2Log("Done (placeholder).");
}

// ------------------------------
// MAIN BUTTON HANDLER
// ------------------------------
generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  const lengthSec = parseInt(lengthInput.value);

  if (!prompt) {
    mv2Log("ERROR: Enter a prompt.");
    return;
  }
  if (isNaN(lengthSec) || lengthSec < 10) {
    mv2Log("ERROR: Length must be at least 10 seconds.");
    return;
  }

  mv2Log("====================================");
  mv2Log("MAXIMUS V2 REACTOR INITIATED");
  mv2Log("Prompt: " + prompt);
  mv2Log("Length: " + lengthSec + " seconds");
  mv2Log("------------------------------------");

  setProgress(0);
  startHum();

  await loadModel();
  await generateAudio(prompt, lengthSec);

  stopHum();
  mv2Log("Reactor cycle complete.");
});
