const envelope = document.getElementById('envelope');
const typedText = document.getElementById('typedText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const final = document.getElementById('final');

const openSound = document.getElementById('openSound');
const music = document.getElementById('music');

const text = '5 años y contando, pero nunca es mal momento para preguntarte si...';
let index = 0;
let noCount = 0;

envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  openSound.play();
  typeWriter();
}, { once: true });

function typeWriter() {
  if (index < text.length) {
    typedText.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}

function moveNoButton() {
  if (noCount < 4) {
    const x = Math.random() * 120 - 60;
    const y = Math.random() * 80 - 40;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    noCount++;

    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

  } else {
    noBtn.textContent = 'Pensalo de nuevo 💭';
    noBtn.classList.add('retry');
    noBtn.style.transform = 'translate(0,0)';
    document.body.classList.add('sad');
  }
}

noBtn.addEventListener('mouseover', moveNoButton);

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});


noBtn.addEventListener('click', () => {
  typedText.textContent = '';
  typedText.classList.add('emotional');
  typedText.textContent = 'No pasa nada… Yo entiendo, siempre entiendo :(';
});


yesBtn.addEventListener('click', () => {
  document.body.classList.remove('sad');
  document.body.classList.add('happy');

  envelope.style.display = 'none';
  final.classList.remove('hidden');

  music.volume = 0.4;
  music.play();

  launchHearts();
  startCountdown();
});


function startCountdown() {
  const target = new Date('2026-02-14T20:30:00');

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  setInterval(() => {
    const diff = target - new Date();

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hoursEl.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    minutesEl.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    secondsEl.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
  }, 1000);
}


const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

let hearts = [];

function launchHearts() {
  hearts = [];
  for (let i = 0; i < 40; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      s: Math.random() * 2 + 1,
      a: Math.random() * Math.PI * 2
    });
  }
  animateHearts();
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach(h => {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.a);
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 10, 0, 20);
    ctx.bezierCurveTo(20, 10, 10, -10, 0, 0);
    ctx.fill();
    ctx.restore();

    h.y -= h.s;
    h.a += 0.01;
  });

  requestAnimationFrame(animateHearts);
}

const isMobile = window.matchMedia('(max-width: 768px)').matches;


if (isMobile) {
  noBtn.addEventListener('click', () => {
    if (noCount < 3) {
      noBtn.classList.add('shake');
      noCount++;
      setTimeout(() => noBtn.classList.remove('shake'), 500);
    } else {
      noBtn.textContent = 'Pensalo de nuevo 💭';
      noBtn.classList.add('retry');
      document.body.classList.add('sad');
    }

    typedText.textContent = 'No pasa nada… Yo entiendo, siempre entiendo 🖤';
  });
}

const colors = ['#1a1a2e', '#2c2c54', '#3a0ca3', '#7209b7'];
let colorIndex = 0;

setInterval(() => {
  document.body.style.background = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
}, 6000);

const emojis = ['💖', '💘', '💔', '✨', '💕'];

function createEmoji() {
  const emoji = document.createElement('div');
  emoji.className = 'floating-emoji';
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  emoji.style.left = Math.random() * 100 + 'vw';
  emoji.style.animationDuration = 6 + Math.random() * 4 + 's';

  document.body.appendChild(emoji);

  setTimeout(() => emoji.remove(), 10000);
}

setInterval(createEmoji, 1200);

if (isMobile) {
  envelope.classList.add('mobile-float');
}
