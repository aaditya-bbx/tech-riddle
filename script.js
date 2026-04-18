// --- THEME TOGGLE LOGIC ---
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggleBtn');
  
  if (body.getAttribute('data-theme') === 'light') {
    body.removeAttribute('data-theme');
    btn.innerText = '☼ Light Mode';
  } else {
    body.setAttribute('data-theme', 'light');
    btn.innerText = '☾ Dark Mode';
  }
}

// --- SHARED DATA ---
const riddles = [
  { theme: "WEARABLES", text: "I sit on your wrist tracking your steps and pulse. I am your personal health telemetry node.", ans: "SMARTWATCH", hint: "A connected device you wear on your arm." },
  { theme: "NETWORKING", text: "I blink in the corner, directing traffic. Without me, your local network is a dark zone.", ans: "ROUTER", hint: "The primary networking device that broadcasts Wi-Fi in your home." },
  { theme: "COMPUTING", text: "I am a computer the size of a credit card. I bring coding to the masses and my name sounds like a summer dessert.", ans: "RASPBERRYPI", hint: "A hugely popular microcomputer beloved by DIY electronics tinkerers." },
  { theme: "DISPLAY", text: "I paint worlds on your wall without a screen. Feed me an HDMI signal, and I'll expand your visual real estate.", ans: "PROJECTOR", hint: "A device that uses a lens to throw a large image onto a blank surface." },
  { theme: "CONNECTIVITY", text: "I connect your devices without any wires over short distances, and I'm named after an ancient Viking king.", ans: "BLUETOOTH", hint: "The wireless technology you use to connect headphones to your phone." },
  { theme: "ROBOTICS", text: "I have spinning rotors and capture the world from a bird's-eye view, often controlled from the ground.", ans: "DRONE", hint: "An unmanned aerial vehicle often used for photography." },
  { theme: "SECURITY", text: "I create a secure, hidden tunnel for your internet traffic, keeping your data private from prying eyes.", ans: "VPN", hint: "Virtual Private Network." },
  { theme: "HARDWARE", text: "I am the main circuit that holds everything together. The CPU, RAM, and GPU all plug directly into me.", ans: "MOTHERBOARD", hint: "The primary printed circuit board in general-purpose computers." },
  { theme: "INFRASTRUCTURE", text: "I carry the internet across oceans not with electricity, but with rapid pulses of light.", ans: "FIBER", hint: "A flexible, transparent fiber made by drawing glass or plastic, used for high-speed internet." },
  { theme: "STORAGE", text: "I am not in the sky, but I hold all your photos and backups in massive remote data centers.", ans: "CLOUD", hint: "The term used for internet-based storage and computing services." }
];

let isCrosswordMode = false;

// --- VIEW TOGGLE ---
function toggleMode() {
  isCrosswordMode = !isCrosswordMode;
  const btn = document.querySelector('.toggle-mode-btn');
  if (isCrosswordMode) {
    document.getElementById('riddleView').style.display = 'none';
    document.getElementById('crosswordView').style.display = 'block';
    btn.innerText = '⇄ Back to Riddle Arena';
    if(!cwInitialized) initCrossword();
  } else {
    document.getElementById('riddleView').style.display = 'block';
    document.getElementById('crosswordView').style.display = 'none';
    btn.innerText = '⇄ Wanna do a crossword instead?';
  }
}

// --- ARENA LOGIC ---
let currentIndex = 0;
let attempted = 0, correct = 0, streak = 0;
const solvedIndices = new Set();

function initRiddles() {
  const dots = document.getElementById('progressDots');
  riddles.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot'; dot.id = `dot-${i}`;
    dots.appendChild(dot);
  });
  loadRiddle(0);
}

function loadRiddle(index) {
  currentIndex = index; const r = riddles[index];
  document.getElementById('themeBadge').innerText = r.theme;
  document.getElementById('riddleCounter').innerText = `RIDDLE 0${index + 1} / ${riddles.length}`;
  document.getElementById('riddleText').innerText = r.text;
  
  const inp = document.getElementById('answerInput');
  inp.value = ''; inp.style.display = 'inline-block'; inp.disabled = false;
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('checkBtn').style.display = 'inline-block';
  
  const hintText = document.getElementById('hintText');
  const hintBtn = document.getElementById('hintBtn');
  hintText.innerText = r.hint;
  hintText.style.display = 'none';
  hintBtn.innerText = 'Need a hint?';
  hintBtn.style.display = 'inline-block';
  
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.remove('active');
    if (i === index) d.classList.add('active');
  });
  inp.focus();
}

function loadRandom() {
  const available = riddles.map((_,i)=>i).filter(i => !solvedIndices.has(i));
  if(available.length === 0) {
    document.getElementById('themeBadge').innerText = "SYSTEM SECURED";
    document.getElementById('riddleText').innerHTML = "<strong>Congratulations!</strong> All files decrypted.";
    document.getElementById('answerInput').style.display = 'none';
    document.getElementById('checkBtn').style.display = 'none';
    document.getElementById('hintBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    return;
  }
  let newIndex = available[Math.floor(Math.random() * available.length)];
  if(newIndex === currentIndex && available.length > 1) {
    while(newIndex === currentIndex) newIndex = available[Math.floor(Math.random() * available.length)];
  }
  loadRiddle(newIndex);
}

function toggleHint() {
  const hintText = document.getElementById('hintText');
  const hintBtn = document.getElementById('hintBtn');
  
  if (hintText.style.display === 'none' || hintText.style.display === '') {
    hintText.style.display = 'block';
    hintBtn.innerText = 'Hide Hint';
  } else {
    hintText.style.display = 'none';
    hintBtn.innerText = 'Need a hint?';
  }
}

function checkAnswer() {
  const inp = document.getElementById('answerInput');
  if(inp.disabled) return;
  
  const userAns = inp.value.toUpperCase().replace(/\s+/g, '');
  if(!userAns) return;

  const isCorrect = userAns.includes(riddles[currentIndex].ans);
  attempted++;
  
  const fb = document.getElementById('feedback');
  fb.style.display = 'block'; 
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('hintBtn').style.display = 'none';
  document.getElementById('hintText').style.display = 'none';
  inp.disabled = true;

  if (isCorrect) {
    correct++; streak++; solvedIndices.add(currentIndex);
    fb.innerHTML = `<span style="color:var(--neon-green)">[ GRANTED ]</span> Correct.`;
    document.getElementById(`dot-${currentIndex}`).style.background = 'var(--accent-teal)';
  } else {
    streak = 0;
    fb.innerHTML = `<span style="color:#ff4444">[ DENIED ]</span> Looking for: ${riddles[currentIndex].ans}`;
  }

  document.getElementById('nextBtn').style.display = 'inline-block';
  document.getElementById('statAttempted').innerText = attempted;
  document.getElementById('statCorrect').innerText = correct;
  document.getElementById('statStreak').innerText = streak;
  document.getElementById('statAccuracy').innerText = Math.round((correct/attempted)*100) + "%";
}

function toggleModal() {
  const m = document.getElementById('solvedModal');
  if(m.style.display === 'flex') m.style.display = 'none';
  else {
    const list = document.getElementById('solvedListContainer');
    list.innerHTML = solvedIndices.size === 0 ? '<p>No files decrypted yet.</p>' : '';
    solvedIndices.forEach(i => {
      list.innerHTML += `<div class="solved-item"><strong style="color:var(--text-muted);">[ ${riddles[i].theme} ]</strong><br>${riddles[i].text}<span class="solved-ans">> ${riddles[i].ans}</span></div>`;
    });
    m.style.display = 'flex';
  }
}

// --- CROSSWORD LAYOUT MAP ---
let cwInitialized = false;

const cwData = [
  { w: "SMARTWATCH", id: 0, x: 5, y: 0, dir: "down", num: 1 },
  { w: "DRONE", id: 5, x: 3, y: 7, dir: "down", num: 2 },
  { w: "MOTHERBOARD", id: 7, x: 2, y: 9, dir: "across", num: 3 },
  { w: "RASPBERRYPI", id: 2, x: 7, y: 9, dir: "down", num: 4 },
  { w: "FIBER", id: 8, x: 0, y: 11, dir: "across", num: 5 },
  { w: "ROUTER", id: 1, x: 14, y: 11, dir: "down", num: 6 },
  { w: "PROJECTOR", id: 3, x: 7, y: 12, dir: "across", num: 7 },
  { w: "CLOUD", id: 9, x: 5, y: 13, dir: "down", num: 8 },
  { w: "BLUETOOTH", id: 4, x: 4, y: 14, dir: "across", num: 9 },
  { w: "VPN", id: 6, x: 6, y: 18, dir: "across", num: 10 }
];

function initCrossword() {
  cwInitialized = true;
  const grid = document.getElementById('crosswordGrid');
  
  grid.style.gridTemplateColumns = `repeat(16, 38px)`;
  grid.style.gridTemplateRows = `repeat(20, 38px)`;

  const cellMap = {};
  
  cwData.forEach(item => {
    for(let i=0; i<item.w.length; i++) {
      let cx = item.dir === 'across' ? item.x + i : item.x;
      let cy = item.dir === 'down' ? item.y + i : item.y;
      let key = `${cx}-${cy}`;
      if(!cellMap[key]) cellMap[key] = { char: item.w[i], num: null };
      if(i === 0 && !cellMap[key].num) cellMap[key].num = item.num;
    }
  });

  for(let y=0; y<20; y++) {
    for(let x=0; x<16; x++) {
      let key = `${x}-${y}`;
      let wrapper = document.createElement('div');
      wrapper.className = 'cw-cell';
      
      if(cellMap[key]) {
        let inp = document.createElement('input');
        inp.type = 'text'; inp.maxLength = 1; inp.className = 'cw-input';
        inp.dataset.ans = cellMap[key].char;
        
        if(cellMap[key].num) {
          let numSpan = document.createElement('span');
          numSpan.className = 'cw-num';
          numSpan.innerText = cellMap[key].num;
          wrapper.appendChild(numSpan);
        }
        
        inp.addEventListener('input', function() {
          if(this.value) {
            this.value = this.value.toUpperCase();
            let next = this.parentElement.nextElementSibling?.querySelector('input');
            if(next) next.focus();
          }
          this.classList.remove('wrong', 'correct');
        });
        
        wrapper.appendChild(inp);
      } else {
        wrapper.classList.add('empty');
      }
      grid.appendChild(wrapper);
    }
  }

  const ulAcross = document.getElementById('cluesAcross');
  const ulDown = document.getElementById('cluesDown');
  
  const sortedData = [...cwData].sort((a,b) => a.num - b.num);
  
  sortedData.forEach(item => {
    let li = document.createElement('li');
    li.innerHTML = `<span class="clue-num">${item.num}.</span> ${riddles[item.id].text}`;
    if(item.dir === 'across') ulAcross.appendChild(li);
    else ulDown.appendChild(li);
  });
}

function checkCrossword() {
  const inputs = document.querySelectorAll('.cw-input');
  let allCorrect = true;
  inputs.forEach(inp => {
    if(!inp.value) { allCorrect = false; }
    else if(inp.value.toUpperCase() === inp.dataset.ans) {
      inp.classList.add('correct'); inp.classList.remove('wrong');
    } else {
      inp.classList.add('wrong'); inp.classList.remove('correct');
      allCorrect = false;
    }
  });
  
  const fb = document.getElementById('cwFeedback');
  fb.style.display = 'block';
  if(allCorrect) {
    fb.innerHTML = `<span style="color:var(--neon-green)">[ SYSTEM OVERRIDDEN ] Grid fully verified.</span>`;
  } else {
    fb.innerHTML = `<span style="color:#ff4444">Errors or missing files detected in the grid. Keep trying.</span>`;
  }
}

window.onload = initRiddles;