const startScreen = document.getElementById('startScreen');
const container = document.getElementById('container');

const envelope = document.getElementById('envelope');
const typedText = document.getElementById('typedText');
const yesBtn = document.getElementById('yesBtn');
let noBtn = document.getElementById('noBtn');
const final = document.getElementById('final');
const actions = document.querySelector('.actions');

const openSound = document.getElementById('openSound');
const music = document.getElementById('music');

const text = '5 años ya, pero nunca es mal momento para preguntarte si...';
let index = 0;


function startExperience() {
  startScreen.classList.add('hidden');
  container.classList.remove('hidden');
  envelope.addEventListener('click', openEnvelope, { once: true });
}

startScreen.addEventListener('click', startExperience);
document.addEventListener('keydown', startExperience);


function openEnvelope() {
  envelope.classList.add('open');
  openSound.play();
  typeWriter();
}


function typeWriter() {
  if (index < text.length) {
    typedText.textContent += text.charAt(index++);
    setTimeout(typeWriter, 60);
  } else {
    actions.classList.add('show');
    setTimeout(detachNoButton, 200);
  }
}

let noX = 0;
let noY = 0;

function detachNoButton() {
  const rect = noBtn.getBoundingClientRect();

  const floatingNo = noBtn.cloneNode(true);
  noBtn.remove();
  noBtn = floatingNo;

  document.body.appendChild(noBtn);

  noX = rect.left;
  noY = rect.top;

  Object.assign(noBtn.style, {
    position: 'fixed',
    left: `${noX}px`,
    top: `${noY}px`,
    zIndex: 9999,
    visibility: 'visible'
  });

  noBtn.addEventListener('click', onNoClick);
}


const trailEmojis = ['😢', '💔', '😭', '🥀', '😞'];
const SCALE = 1.1;

function fleeFromMouse(x, y) {
  const w = noBtn.offsetWidth * SCALE;
  const h = noBtn.offsetHeight * SCALE;

  const cx = noX + w / 2;
  const cy = noY + h / 2;

  let dx = cx - x;
  let dy = cy - y;

  const dist = Math.hypot(dx, dy) || 1;
  dx /= dist;
  dy /= dist;

  const BASE_STRENGTH = 20;  
  const MAX_STRENGTH = 50;  
  const proximity = Math.max(0.3, Math.min(1, dist / 240));
  const strength = BASE_STRENGTH + (1 - proximity) * (MAX_STRENGTH - BASE_STRENGTH);

  noX += dx * strength;
  noY += dy * strength;

  const pad = 10;
  noX = Math.max(pad, Math.min(window.innerWidth - w - pad, noX));
  noY = Math.max(pad, Math.min(window.innerHeight - h - pad, noY));

  noBtn.style.left = `${noX}px`;
  noBtn.style.top = `${noY}px`;

  spawnTrail(cx, cy);
}


document.addEventListener('mousemove', (e) => {
  if (!actions.classList.contains('show')) return;

  const r = noBtn.getBoundingClientRect();
  const d = Math.hypot(
    e.clientX - (r.left + r.width / 2),
    e.clientY - (r.top + r.height / 2)
  );

  if (d < 80) fleeFromMouse(e.clientX, e.clientY);
});



function spawnTrail(x, y) {
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'emoji-trail';
    el.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
    el.style.left = x + (Math.random() * 60 - 30) + 'px';
    el.style.top = y + (Math.random() * 40 - 20) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}



function onNoClick(e) {
  typedText.textContent = 'No pasa nada… Yo entiendo, siempre entiendo :(';
}


yesBtn.addEventListener('click', () => {

  noBtn.style.display = 'none';
  noBtn.style.pointerEvents = 'none';

  envelope.style.display = 'none';

  final.classList.remove('hidden');

  music.volume = 0.4;
  music.play();

  startCountdown();
  startHeartRain();
});

function startCountdown() {
  const target = new Date('2026-02-14T20:30:00');

  setInterval(() => {
    const diff = target - new Date();
    if (diff <= 0) return;

    days.textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
    hours.textContent = String(Math.floor(diff/3600000)%24).padStart(2,'0');
    minutes.textContent = String(Math.floor(diff/60000)%60).padStart(2,'0');
    seconds.textContent = String(Math.floor(diff/1000)%60).padStart(2,'0');
  }, 1000);
}

function startHeartRain() {
  const hearts = ['💖','💘','💕','❤️','💗'];

  const interval = setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'floating-emoji';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }, 120);

  window.heartRainInterval = interval;
}
