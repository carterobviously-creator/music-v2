// main.js
// Web Audio API Implementation for Music Generation, Waveform Rendering, and WAV Export 

// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Music generation function
function generateMusic(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Waveform rendering function
function renderWaveform() {
    const canvas = document.getElementById('waveform');
    const canvasContext = canvas.getContext('2d');
    const analyser = audioContext.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.fftSize = 2048;
    analyser.getByteTimeDomainData(dataArray);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
}

// WAV export function
function exportWAV() {
    const actualLength = audioContext.sampleRate * audioContext.currentTime;
    const wavBuffer = new ArrayBuffer(44 + actualLength * 2);
    const view = new DataView(wavBuffer);

    // WAV header
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + actualLength * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, audioContext.sampleRate, true);
    view.setUint32(28, audioContext.sampleRate * 2, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, actualLength * 2, true);

    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'music.wav';
    document.body.appendChild(a);
    a.click();
}

function writeUTFBytes(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Usage Example:
generateMusic(440, 2);  // Generate a 440Hz tone for 2 seconds
renderWaveform();
exportWAV();
