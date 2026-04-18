const riddles = [
  {
    theme: "CLOUD STORAGE",
    text: "I am a bucket that holds no water, just objects in the sky. I don't freeze, but my deepest archive is a Glacier. What am I?",
    answers: ["s3", "amazon s3", "aws s3", "cloud storage", "glacier"],
    hint: "Think about Amazon's web services and where you might store unstructured data."
  },
  {
    theme: "HOME MEDIA",
    text: "I organize your vast digital library using scrapers and smart playlists. I am an open-source hub for your screens, perfect for managing your anime collection. What am I?",
    answers: ["kodi", "media center", "xbmc", "plex"],
    hint: "It's a highly customizable open-source media player software."
  },
  {
    theme: "GAMING TECH",
    text: "I predict the future between frames to make your game run smoother. Some call me interpolation, others call me fluid motion. What am I?",
    answers: ["frame generation", "afmf", "fsr", "fsr 3", "dlss", "fluid motion frames"],
    hint: "A technique used by AMD and NVIDIA to artificially boost frame rates."
  },
  {
    theme: "EDGE COMPUTING",
    text: "I am a computer the size of a credit card. I can run a portable DIY project or a smart home, and my name sounds like a summer fruit. What am I?",
    answers: ["raspberry pi", "rpi", "raspberry pi pico", "microcontroller"],
    hint: "A very popular, low-cost single-board computer."
  },
  {
    theme: "AUDIO GEAR",
    text: "I fit snugly in your ear canal to isolate you from the outside world. I deliver high-fidelity sound, and audiophiles love analyzing my frequency response graphs. What am I?",
    answers: ["iem", "in ear monitor", "in-ear monitor", "earbuds", "earphones"],
    hint: "Professional-grade earphones that sit deep inside the ear."
  },
  {
    theme: "DISPLAY HARDWARE",
    text: "I project worlds onto your wall but have no screen of my own. Give me a solid HDMI connection, and I'll expand your gaming horizons. What am I?",
    answers: ["projector", "video projector", "smart projector"],
    hint: "It uses a lens and light to throw an image onto a blank surface."
  },
  {
    theme: "NETWORKING",
    text: "I sit blinking in the corner, directing invisible packets of information. Without me, your local area network falls silent. What am I?",
    answers: ["router", "wi-fi router", "wifi router", "modem", "switch"],
    hint: "The device that assigns IP addresses and broadcasts your Wi-Fi signal."
  },
  {
    theme: "SMART HOME",
    text: "I have no eyes, but I see who is at your front step. I have no voice, but I tell your phone when a package arrives. What am I?",
    answers: ["smart doorbell", "doorbell camera", "video doorbell", "ring doorbell"],
    hint: "An IoT device that replaces your traditional doorbell."
  },
  {
    theme: "WEARABLES",
    text: "I sit on your wrist and track your telemetry, but I have no legs. I measure your biometrics, but I am not a doctor. What am I?",
    answers: ["smartwatch", "fitness tracker", "smart watch", "apple watch"],
    hint: "A connected band you wear on your arm."
  },
  {
    theme: "SMART CITY",
    text: "I stand on the street corner and change my colors. I talk to the grid to clear the way when traffic gets heavy. What am I?",
    answers: ["smart traffic light", "traffic light", "smart signal", "traffic signal"],
    hint: "An automated system controlling intersection flow based on real-time data."
  }
];

let currentIndex = 0;
let attempted = 0;
let correct = 0;
let streak = 0;
let hasHinted = false;

// DOM Elements
const riddleText = document.getElementById('riddleText');
const themeBadge = document.getElementById('themeBadge');
const riddleCounter = document.getElementById('riddleCounter');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const hintText = document.getElementById('hintText');
const hintBtn = document.getElementById('hintBtn');
const nextBtn = document.getElementById('nextBtn');
const checkBtn = document.getElementById('checkBtn');
const progressDots = document.getElementById('progressDots');

// Init
function init() {
  renderDots();
  loadRiddle(0);
}

function renderDots() {
  progressDots.innerHTML = '';
  riddles.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.id = `dot-${i}`;
    progressDots.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === currentIndex) dot.classList.add('active');
  });
}

function loadRiddle(index) {
  currentIndex = index;
  const riddle = riddles[currentIndex];
  
  themeBadge.innerText = riddle.theme;
  riddleCounter.innerText = `RIDDLE 0${currentIndex + 1} / ${riddles.length}`;
  riddleText.innerText = riddle.text;
  
  answerInput.value = '';
  answerInput.disabled = false;
  feedback.style.display = 'none';
  nextBtn.style.display = 'none';
  checkBtn.style.display = 'inline-block';
  
  hintText.innerText = riddle.hint;
  hintText.style.display = 'none';
  hintBtn.style.display = 'inline-block';
  hasHinted = false;
  
  updateDots();
  answerInput.focus();
}

function loadRandom() {
  let newIndex = currentIndex;
  while(newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * riddles.length);
  }
  loadRiddle(newIndex);
}

function toggleHint() {
  if (hintText.style.display === 'none') {
    hintText.style.display = 'block';
    hintBtn.innerText = 'Hide Hint';
    hasHinted = true;
  } else {
    hintText.style.display = 'none';
    hintBtn.innerText = 'Need a hint?';
  }
}

function updateStats() {
  document.getElementById('statAttempted').innerText = attempted;
  document.getElementById('statCorrect').innerText = correct;
  document.getElementById('statStreak').innerText = streak;
  
  const acc = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  document.getElementById('statAccuracy').innerText = `${acc}%`;
}

function checkAnswer() {
  if(answerInput.disabled) return;
  
  const userAns = answerInput.value.toLowerCase().trim();
  if(!userAns) return;

  const riddle = riddles[currentIndex];
  const isCorrect = riddle.answers.some(ans => userAns.includes(ans));

  attempted++;
  
  feedback.style.display = 'block';
  checkBtn.style.display = 'none';
  hintBtn.style.display = 'none';
  hintText.style.display = 'none';
  answerInput.disabled = true;

  if (isCorrect) {
    correct++;
    streak++;
    feedback.innerHTML = `<span style="color:var(--neon-green)">[ ACCESS GRANTED ]</span> Correct.`;
    document.getElementById(`dot-${currentIndex}`).style.background = 'var(--neon-green)';
    document.getElementById(`dot-${currentIndex}`).style.boxShadow = '0 0 10px var(--neon-green)';
  } else {
    streak = 0;
    feedback.innerHTML = `<span style="color:#ff4444">[ ACCESS DENIED ]</span> Incorrect. The system was looking for: ${riddle.answers[0].toUpperCase()}`;
    document.getElementById(`dot-${currentIndex}`).style.background = '#ff4444';
    document.getElementById(`dot-${currentIndex}`).style.boxShadow = '0 0 10px #ff4444';
  }

  nextBtn.style.display = 'inline-block';
  updateStats();
}

// Start app
window.onload = init;
