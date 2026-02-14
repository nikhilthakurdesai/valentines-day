/**
 * Valentine's Day Scavenger Hunt — config (edit answers to personalize)
 */
const QUIZ_CONFIG = [
  { question: 'When did we first meet?', answers: ['feb 14 2025', '14th feb 2025', '14 feb 2025', '14/02/2025'], note: "Don't be so happy, I started with an easy one 😏" },
  { question: 'What is my favourite nickname of yours?', answers: ['fuljhadiii', 'fuljhadi'], note: 'Fuljhadiiiiiiiiiii\nDon\'t tell me you struggled with this one 😮‍💨' },
  { question: 'Where was our first date?', answers: ['collage by toscano', 'toscano'], noteToscano: 'Wrong Wrong! But fine, I will accept it huh 😛\nPS: It was Collage By Toscano\nPPS: It\'s permanently closed now 😂', noteFull: "Wow! I wasn't expecting that one!" },
  { question: 'Who do you love the most? 😉', answers: ['nikhil'], note: 'Awww I love you too 😘' }
];

const COUNTER_FINAL = 365;
/** Phased timing (ms) */
const COUNTER_PHASES_MS = [
  1500,  /* 0 to 200: 1.5s */
  900,   /* 201 to 300: 0.9s */
  500,   /* 301 to 330: 0.5s */
  400,   /* 331 to 350: 0.4s */
  400,   /* 351 to 355: 0.4s */
  1500,  /* 356 to 360: 1.5s */
  2000   /* 361 to 365: 2s */
];
const COUNTER_TOTAL_MS = COUNTER_PHASES_MS[0] + COUNTER_PHASES_MS[1] + COUNTER_PHASES_MS[2] + COUNTER_PHASES_MS[3] + COUNTER_PHASES_MS[4] + COUNTER_PHASES_MS[5] + COUNTER_PHASES_MS[6];

(function () {
  const daysEl = document.getElementById('daysCounter');
  const vaultSection = document.getElementById('vaultSection');
  const revealContainer = document.getElementById('revealContainer');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const bgMusic = document.getElementById('bgMusic');

  /** Counter value at elapsed ms */
  function getCounterValue(elapsed) {
    if (elapsed >= COUNTER_TOTAL_MS) return COUNTER_FINAL;
    let t = 0;
    if (elapsed < COUNTER_PHASES_MS[0]) {
      return (elapsed / COUNTER_PHASES_MS[0]) * 200;
    }
    t = elapsed - COUNTER_PHASES_MS[0];
    if (t < COUNTER_PHASES_MS[1]) {
      return 200 + (t / COUNTER_PHASES_MS[1]) * 100;
    }
    t -= COUNTER_PHASES_MS[1];
    if (t < COUNTER_PHASES_MS[2]) {
      return 300 + (t / COUNTER_PHASES_MS[2]) * 30;
    }
    t -= COUNTER_PHASES_MS[2];
    if (t < COUNTER_PHASES_MS[3]) {
      return 330 + (t / COUNTER_PHASES_MS[3]) * 20;
    }
    t -= COUNTER_PHASES_MS[3];
    if (t < COUNTER_PHASES_MS[4]) {
      return 350 + (t / COUNTER_PHASES_MS[4]) * 5;
    }
    t -= COUNTER_PHASES_MS[4];
    if (t < COUNTER_PHASES_MS[5]) {
      return 355 + (t / COUNTER_PHASES_MS[5]) * 5;
    }
    t -= COUNTER_PHASES_MS[5];
    return 360 + (t / COUNTER_PHASES_MS[6]) * 5;
  }

  function animateCounter() {
    const heartBurstEl = document.getElementById('heartBurst');
    const start = performance.now();
    let burstTriggered = false;
    function tick(now) {
      const elapsed = now - start;
      const value = Math.round(getCounterValue(elapsed));
      if (daysEl) daysEl.textContent = Math.min(value, COUNTER_FINAL);
      if (elapsed >= COUNTER_TOTAL_MS && !burstTriggered && heartBurstEl) {
        burstTriggered = true;
        heartBurstEl.classList.add('trigger');
      }
      if (elapsed < COUNTER_TOTAL_MS) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function normalizeAnswer(str) {
    return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function checkAnswer(index, userAnswer) {
    const config = QUIZ_CONFIG[index];
    if (!config) return false;
    const normalized = normalizeAnswer(userAnswer);
    if (!normalized) return false;
    return config.answers.some(function (a) { return normalized === normalizeAnswer(a) || normalized.includes(normalizeAnswer(a)); });
  }

  function shakeInput(inputEl) {
    if (!inputEl) return;
    inputEl.classList.add('shake');
    inputEl.focus();
    setTimeout(function () { inputEl.classList.remove('shake'); }, 500);
  }

  function runConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#ec407a', '#f48fb1', '#f8bbd9', '#c2185b', '#fff'];
    const count = 120;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.6) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20
      });
    }
    let startTime = null;
    function frame(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      if (elapsed > 3500) {
        confettiCanvas.style.opacity = '0';
        setTimeout(function () {
          confettiCanvas.style.display = 'none';
        }, 300);
        return;
      }
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotationSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function unlock() {
    runConfetti();
    if (vaultSection) vaultSection.hidden = true;
    if (revealContainer) revealContainer.hidden = false;
    try {
      bgMusic.play().catch(function () {});
    } catch (e) {}
  }

  vaultSection.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.classList && !form.classList.contains('quiz-form')) return;
    e.preventDefault();
    var index = parseInt(form.getAttribute('data-question'), 10);
    if (isNaN(index) || index < 0 || index >= QUIZ_CONFIG.length) return;
    var inputEl = form.querySelector('.quiz-input');
    var answer = inputEl ? inputEl.value : '';
    if (!checkAnswer(index, answer)) {
      shakeInput(inputEl);
      return;
    }
    var item = form.closest('.quiz-timeline-item');
    if (!item) return;
    var normalized = normalizeAnswer(answer);
    var config = QUIZ_CONFIG[index];
    item.classList.add('done');
    item.classList.remove('open');
    var doneEl = item.querySelector('.quiz-card-done');
    if (doneEl) { doneEl.hidden = false; }
    var noteEl = item.querySelector('.quiz-card-note');
    if (noteEl && config) {
      var noteText = index === 2 ? (normalized === 'toscano' ? config.noteToscano : config.noteFull) : config.note;
      if (noteText) {
        noteEl.textContent = noteText;
        noteEl.hidden = false;
      }
    }
    if (index >= QUIZ_CONFIG.length - 1) {
      unlock();
      return;
    }
    var nextItem = vaultSection.querySelector('.quiz-timeline-item[data-index="' + (index + 1) + '"]');
    if (nextItem) {
      nextItem.classList.remove('locked');
      nextItem.classList.add('open');
      var connector = nextItem.previousElementSibling;
      if (connector && connector.classList.contains('quiz-connector')) {
        connector.classList.add('visible');
      }
      var nextInput = nextItem.querySelector('.quiz-input');
      if (nextInput) { nextInput.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (confettiCanvas && confettiCanvas.style.display !== 'none') {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  (function envelopeLetter() {
    var wrapper = document.getElementById('envelopeWrapper');
    var closed = document.getElementById('envelopeClosed');
    var letterReveal = document.getElementById('letterReveal');
    if (!wrapper || !closed || !letterReveal) return;
    var hoverCount = 0;
    var opened = false;
    var lastX = 0;
    var lastY = 0;

    function getMinDistance() {
      return Math.round(0.2 * (typeof window !== 'undefined' ? window.innerWidth : 320));
    }

    function clampPosition(x, y) {
      var maxX = Math.round(0.38 * window.innerWidth);
      var maxY = Math.round(0.22 * window.innerHeight);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y))
      };
    }

    function moveEnvelope() {
      var minDist = getMinDistance();
      var x, y;
      if (lastX === 0 && lastY === 0) {
        var angle = Math.random() * Math.PI * 2;
        var dist = minDist + Math.random() * minDist * 0.5;
        x = Math.round(Math.cos(angle) * dist);
        y = Math.round(Math.sin(angle) * dist);
      } else {
        x = -lastX;
        y = -lastY;
        var dist = Math.sqrt(x * x + y * y);
        if (dist < minDist && dist > 0) {
          var scale = minDist / dist;
          x = Math.round(x * scale);
          y = Math.round(y * scale);
        }
      }
      var clamped = clampPosition(x, y);
      x = clamped.x;
      y = clamped.y;
      lastX = x;
      lastY = y;
      wrapper.style.transform = 'translate(calc(-50% + ' + x + 'px), ' + y + 'px)';
    }

    function openEnvelope() {
      if (opened) return;
      opened = true;
      closed.classList.add('opening');
      setTimeout(function () {
        wrapper.classList.add('opened');
        letterReveal.classList.add('visible');
      }, 550);
    }

    function onEnvelopeInteract() {
      if (opened) return;
      hoverCount += 1;
      if (hoverCount <= 5) {
        moveEnvelope();
      } else {
        openEnvelope();
      }
    }
    wrapper.addEventListener('mouseenter', onEnvelopeInteract);
    wrapper.addEventListener('click', function (e) {
      e.preventDefault();
      onEnvelopeInteract();
    });
  })();

  animateCounter();
})();
