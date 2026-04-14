const RIDDLES = [
  {
    id: 1, theme: "Smart Home",
    riddle: "I live on your wall and I never forget. I watch when you leave in the morning and when you come home at night. Without being told, I make the room warmer before you arrive and cooler while you sleep. After about a week, I know your routine better than you do. What am I?",
    hint: "You'd find me near a wall, controlling the temperature of a room — but I'm much smarter than an old dial.",
    answer: "Smart Thermostat",
    synonyms: ["smart thermostat","thermostat","nest","ecobee","smart heating","connected thermostat","intelligent thermostat","smart temperature control","digital thermostat"]
  },
  {
    id: 2, theme: "Wearables",
    riddle: "I wrap around your wrist and know your heart better than most people do. I count every step you take, track how deeply you sleep, and quietly warn you when something feels off. I look like a watch but I do far more than tell the time. What am I?",
    hint: "You wear it on your wrist. Brands like Apple, Fitbit, and Garmin make popular versions.",
    answer: "Smartwatch",
    synonyms: ["smartwatch","smart watch","fitness band","fitness tracker","wearable","smart band","apple watch","fitbit","activity tracker","health tracker","wearable device","smart wristband"]
  },
  {
    id: 3, theme: "Voice Assistant",
    riddle: "I sit in the corner of a room and listen — always. Say the right word and I wake up instantly. I can play your favourite song, read you the news, set a timer, or add something to your shopping list. I have no face, no screen, and no hands. I am just a voice that answers. What am I?",
    hint: "Think of a small round or cylindrical speaker you talk to. 'Hey Alexa' or 'OK Google' might ring a bell.",
    answer: "Smart Speaker",
    synonyms: ["smart speaker","voice assistant","alexa","google home","amazon echo","echo","siri","google nest","virtual assistant","voice activated speaker","ai assistant","smart assistant","echo dot"]
  },
  {
    id: 4, theme: "Connectivity",
    riddle: "I am invisible but fill every corner of your home. Without me, your laptop goes silent, your phone loses its mind, and your smart TV turns back into an ordinary box. I travel through walls and floors carrying information at incredible speed. Everyone in the house knows my password — or at least they should. What am I?",
    hint: "You connect to this every day at home without thinking about it. Your phone asks for this when you move to a new place.",
    answer: "WiFi",
    synonyms: ["wifi","wi-fi","wireless internet","wireless network","internet","home network","broadband","router","wireless connection","home wifi","wireless"]
  },
  {
    id: 5, theme: "Smart Security",
    riddle: "I watch your front door while you sleep, and I send a video to your phone the moment anyone approaches — whether it is a delivery driver, a neighbour, or a stray cat at 3am. You can check on me from anywhere in the world as long as you have a signal. What am I?",
    hint: "It's a camera at your front door that connects to your phone. Ring is one of the most famous brands.",
    answer: "Smart Doorbell",
    synonyms: ["smart doorbell","video doorbell","ring doorbell","ring","smart camera","security camera","connected camera","doorbell camera","smart security camera","video camera doorbell","door camera"]
  },
  {
    id: 6, theme: "Data & Storage",
    riddle: "I have no shape you can touch, yet I hold your photos, your documents, your memories. Drop your phone in the sea — I survive. Spill coffee on your laptop — I am perfectly fine. I live somewhere between here and everywhere, accessible from any device in the world. What am I?",
    hint: "Google Drive, iCloud, and Dropbox are examples. The name comes from what you see on a rainy day in the sky.",
    answer: "Cloud Storage",
    synonyms: ["cloud storage","cloud","the cloud","cloud computing","icloud","google drive","dropbox","onedrive","online storage","cloud backup","cloud service","cloud drive"]
  },
  {
    id: 7, theme: "Everyday Tech",
    riddle: "I am a small square made of black and white dots, and I hold more than I look. Point a phone camera at me and I take you somewhere instantly — a restaurant menu, a payment page, a website, an event ticket. I was invented in a Japanese car factory but now I appear on receipts, posters, and restaurant tables everywhere. What am I?",
    hint: "You have probably scanned one of these instead of reading a printed menu at a café.",
    answer: "QR Code",
    synonyms: ["qr code","qr","quick response code","barcode","2d barcode","quick response","qr scan","matrix code"]
  },
  {
    id: 8, theme: "Smart City",
    riddle: "I stand at every crossroads in the city. I used to work on a simple clock — green, amber, red, repeat. Now I watch the road, count the cars passing, and decide how long to stay green depending on what I see. On a quiet Sunday I move quickly; on a rush-hour Friday I think harder. What am I?",
    hint: "You wait for this device every day when crossing a road or driving through a junction.",
    answer: "Smart Traffic Light",
    synonyms: ["smart traffic light","traffic light","traffic signal","smart signal","intelligent traffic light","adaptive traffic light","connected traffic light","traffic management","smart junction","traffic controller"]
  },
  {
    id: 9, theme: "Connected Health",
    riddle: "Doctors place me on patients who need watching. I am light enough to forget I am wearing me. Every few seconds I quietly send a message — heart rate, temperature, breathing — to a nurse who might be down the corridor or in a different building entirely. I speak so the patient does not have to. What am I?",
    hint: "Think of a small device worn on the body that sends health information to medical staff wirelessly.",
    answer: "Patient Monitor",
    synonyms: ["patient monitor","remote patient monitor","health monitor","medical sensor","wearable monitor","health sensor","remote monitoring device","vital signs monitor","connected health device","medical wearable","body sensor","remote monitor"]
  },
  {
    id: 10, theme: "Smart Appliances",
    riddle: "I sit in your kitchen and keep things cold, but I have grown ambitious. I can now see what is inside me, tell you when the milk is about to expire, suggest a recipe based on what you have left, and place an order for more eggs before you even notice you are running low. I am the most ordinary appliance, made extraordinary. What am I?",
    hint: "Every kitchen has one. It keeps your food fresh. Now imagine it could also talk to your phone.",
    answer: "Smart Fridge",
    synonyms: ["smart fridge","smart refrigerator","connected fridge","connected refrigerator","fridge","refrigerator","intelligent fridge","iot fridge","smart kitchen appliance","smart freezer","connected appliance"]
  }
];

let stats = { attempted: 0, correct: 0, streak: 0 };
let currentRiddle = null;
let answered = false;
let usedIndices = [];
let hintOpen = false;
let qrOpen = false;

function norm(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }

function isCorrect(input, riddle) {
  const n = norm(input);
  if (!n) return false;
  return riddle.synonyms.some(s => { const ns = norm(s); return ns === n || ns.includes(n) || n.includes(ns); });
}

function buildDots() {
  const c = document.getElementById('progressDots');
  c.innerHTML = '';
  RIDDLES.forEach((_, i) => {
    const d = document.createElement('div'); d.className = 'prog-dot'; d.id = 'dot-' + i; c.appendChild(d);
  });
}

function updateStats() {
  document.getElementById('statAttempted').textContent = stats.attempted;
  document.getElementById('statCorrect').textContent = stats.correct;
  document.getElementById('statStreak').textContent = stats.streak + (stats.streak >= 3 ? ' 🔥' : '');
  document.getElementById('statAccuracy').textContent = stats.attempted ? Math.round(stats.correct / stats.attempted * 100) + '%' : '—';
}

function loadRandom() {
  answered = false; hintOpen = false; qrOpen = false;
  const inp = document.getElementById('answerInput');
  inp.value = ''; inp.className = 'answer-input'; inp.disabled = false;
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('nextBtn').className = 'next-btn';
  document.getElementById('hintText').className = 'hint-text';
  document.getElementById('hintText').textContent = '';
  document.getElementById('hintBtn').textContent = 'Need a hint?';
  document.getElementById('qrPanel').className = 'qr-panel';

  let available = RIDDLES.map((_,i) => i).filter(i => !usedIndices.includes(i));
  if (!available.length) { usedIndices = []; available = RIDDLES.map((_,i) => i); }
  const idx = available[Math.floor(Math.random() * available.length)];
  usedIndices.push(idx);
  if (usedIndices.length > 5) usedIndices.shift();
  currentRiddle = RIDDLES[idx];

  document.querySelectorAll('.prog-dot').forEach(d => d.classList.remove('current'));
  const dot = document.getElementById('dot-' + idx);
  if (dot) dot.classList.add('current');

  document.getElementById('themeBadge').textContent = currentRiddle.theme.toUpperCase();
  document.getElementById('riddleCounter').textContent = 'RIDDLE ' + String(currentRiddle.id).padStart(2,'0') + ' / 10';
  document.getElementById('riddleText').textContent = currentRiddle.riddle;

  // New Static QR Code Logic
  const qrC = document.getElementById('qrContainer');
  qrC.innerHTML = `<img src="qr-${currentRiddle.id}.png" alt="QR Code for Riddle ${currentRiddle.id}" style="width: 150px; height: 150px; display: block;">`;

  const arena = document.getElementById('arena');
  arena.style.animation = 'none'; void arena.offsetWidth; arena.style.animation = 'fadeIn 0.4s ease';
  setTimeout(() => inp.focus(), 150);
}

function toggleQR() {
  qrOpen = !qrOpen;
  document.getElementById('qrPanel').className = 'qr-panel' + (qrOpen ? ' open' : '');
}

function toggleHint() {
  hintOpen = !hintOpen;
  const ht = document.getElementById('hintText');
  const hb = document.getElementById('hintBtn');
  if (hintOpen) { ht.textContent = '💡 ' + currentRiddle.hint; ht.className = 'hint-text open'; hb.textContent = 'Hide hint'; }
  else { ht.className = 'hint-text'; hb.textContent = 'Need a hint?'; }
}

function checkAnswer() {
  if (answered || !currentRiddle) return;
  const inp = document.getElementById('answerInput');
  const val = inp.value.trim();
  if (!val) { inp.focus(); return; }

  answered = true;
  stats.attempted++;
  document.getElementById('checkBtn').disabled = true;
  inp.disabled = true;

  const ok = isCorrect(val, currentRiddle);
  const dotIdx = RIDDLES.indexOf(currentRiddle);
  const dot = document.getElementById('dot-' + dotIdx);
  if (dot) { dot.classList.remove('current'); dot.classList.add(ok ? 'correct' : 'wrong'); }

  const fb = document.getElementById('feedback');
  if (ok) {
    stats.correct++; stats.streak++;
    inp.className = 'answer-input correct-border';
    fb.className = 'feedback correct';
    fb.innerHTML = '✓ &nbsp;Correct! Nice thinking.';
  } else {
    stats.streak = 0;
    inp.className = 'answer-input wrong-border';
    fb.className = 'feedback wrong';
    fb.innerHTML = '✗ &nbsp;Not quite — keep it in mind for next time.'
      + '<div class="correct-ans">The answer was: <span>' + currentRiddle.answer + '</span></div>';
  }

  updateStats();
  document.getElementById('nextBtn').className = 'next-btn visible';
}

buildDots();
updateStats();
window.addEventListener('load', () => setTimeout(loadRandom, 200));