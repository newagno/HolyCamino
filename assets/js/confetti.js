let confettiFrameId = null;
let confettiTimeoutId = null;

function spiralPathString(turns = 2.5, steps = 60, a = 0.6, b = 0.55) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = a * Math.exp(b * t * 0.15);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    d += i === 0 ? `M ${x},${y} ` : `L ${x},${y} `;
  }
  return d;
}

const SHAPES = [
  // 1. Гребінець (Scallop) — віяло з радіальними ребрами
  {
    body: new Path2D('M -18,10 C -18,-10 -8,-22 0,-22 C 8,-22 18,-10 18,10 C 12,16 6,19 0,19 C -6,19 -12,16 -18,10 Z'),
    lines: new Path2D('M 0,19 L 0,-22 M -6,18 L -9,-18 M 6,18 L 9,-18 M -12,15 L -15,-10 M 12,15 L 15,-10'),
  },
  // 2. Спіральна мушля равлика (Nautilus)
  {
    body: new Path2D(spiralPathString(2.3, 70, 0.8, 0.5) + ' Z'),
    lines: new Path2D(spiralPathString(2.3, 70, 0.8, 0.5)),
  },
  // 3. Двостулкова мушля (Clam) — концентричні дуги росту
  {
    body: new Path2D('M -20,0 C -20,-14 -10,-22 0,-22 C 10,-22 20,-14 20,0 C 20,10 10,20 0,20 C -10,20 -20,10 -20,0 Z'),
    lines: new Path2D('M -20,0 C -12,-4 12,-4 20,0 M -16,8 C -8,4 8,4 16,8 M -11,14 C -5,11 5,11 11,14'),
  },
  // 4. Конічна мушля (Cone shell)
  {
    body: new Path2D('M -3,-22 L 3,-22 L 10,-8 L 3,22 L -3,22 L -10,-8 Z'),
    lines: new Path2D('M -10,-8 L 10,-8 M -7,0 L 7,0 M -5,9 L 5,9 M 0,-22 L 0,22'),
  },
  // 5. Морська зірка (Starfish)
  {
    body: new Path2D('M 0,-20 L 5,-5 L 20,-5 L 8,4 L 13,19 L 0,10 L -13,19 L -8,4 L -20,-5 L -5,-5 Z'),
    lines: new Path2D('M 0,0 L 0,-20 M 0,0 L 13,19 M 0,0 L -13,19 M 0,0 L 20,-5 M 0,0 L -20,-5'),
  },
];

/**
 * Анімація падіння мушель-конфеті на елементі canvas.
 * @param {HTMLCanvasElement} canvas
 */
export function startConfetti(canvas) {
  if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
  if (confettiTimeoutId) clearTimeout(confettiTimeoutId);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.style.pointerEvents = 'none';

  const COLORS = ['#c8553d', '#6b7d3a', '#c9a64b', '#5a7d8c', '#8a5a44'];

  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: (Math.random() * 1.1 + 0.7) * dpr,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 4 * dpr,
    vy: (Math.random() * 3 + 2.5) * dpr,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 4,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));

  let isRunning = true;

  function draw() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.scale(p.r, p.r);

      // прозорий силует: майже без заливки, колір тільки в контурі
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.12;
      ctx.fill(p.shape.body);

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.4;
      ctx.stroke(p.shape.body);
      ctx.stroke(p.shape.lines);

      ctx.restore();

      p.x += p.vx + Math.sin(p.y / 30) * 0.5;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > canvas.height + 40) {
        p.y = -40;
        p.x = Math.random() * canvas.width;
      }
    }
    confettiFrameId = requestAnimationFrame(draw);
  }

  const stopConfetti = () => {
    isRunning = false;
    cancelAnimationFrame(confettiFrameId);
    clearTimeout(confettiTimeoutId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener('click', stopConfetti);
    document.removeEventListener('touchstart', stopConfetti);
  };

  draw();

  setTimeout(() => {
    document.addEventListener('click', stopConfetti);
    document.addEventListener('touchstart', stopConfetti, { passive: true });
  }, 300);

  confettiTimeoutId = setTimeout(stopConfetti, 22000);
}