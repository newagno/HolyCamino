let confettiFrameId = null;
let confettiTimeoutId = null;

const SHAPES = [
  // 1. Гребінець (Camino Vieira). Ширший зверху, має пласке "вушко" в основі та радіальні ребра.
  {
    body: new Path2D('M -6,14 L 6,14 L 9,11 C 22,11 24,-6 14,-15 C 6,-22 -6,-22 -14,-15 C -24,-6 -22,11 -9,11 Z'),
    lines: new Path2D('M 0,14 L 0,-18 M -3,14 L -9,-15 M 3,14 L 9,-15 M -6,12 L -16,-6 M 6,12 L 16,-6')
  },
  // 2. Равлик (Спіраль). Асиметричний краплеподібний силует, внутрішня лінія закручується у спіраль.
  {
    body: new Path2D('M -5,18 C -22,18 -22,-18 -2,-18 C 18,-18 24,2 12,16 C 8,21 0,20 -5,18 Z'),
    lines: new Path2D('M 10,16 C 25,-2 5,-20 -10,-10 C -20,0 -10,15 2,10 C 10,5 5,-5 -2,-2')
  },
  // 3. Мідія (Clam). Витягнута крапля з концентричними, вигнутими лініями росту.
  {
    body: new Path2D('M -14,14 C -22,2 -16,-16 4,-20 C 18,-20 22,6 10,16 C 2,22 -8,22 -14,14 Z'),
    lines: new Path2D('M -8,-15 C 4,-18 12,-4 8,6 M -12,-8 C -2,-10 5,2 2,12')
  },
  // 4. Конічна мушля (Cone shell). Плавні бічні стінки, внутрішні смуги вигнуті дугою (Q) для об'єму.
  {
    body: new Path2D('M 0,-22 C 5,-14 12,8 8,20 C 0,24 -8,24 -8,20 C -12,8 -5,-14 0,-22 Z'),
    lines: new Path2D('M -3,-13 Q 0,-11 5,-10 M -8,-2 Q 0,0 9,-1 M -10,9 Q 0,12 10,8 M -8,18 Q 0,20 8,16')
  },
  // 5. Морська зірка (Starfish). М'які, вигнуті щупальця.
  {
    body: new Path2D('M 0,-20 Q 3,-8 15,-6 Q 5,-2 12,18 Q 0,8 -12,18 Q -5,-2 -15,-6 Q -3,-8 0,-20 Z'),
    lines: new Path2D('M 0,0 L 0,-17 M 0,0 L 12,-5 M 0,0 L -12,-5 M 0,0 L 9,15 M 0,0 L -9,15')
  }
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

      // Прозорий силует
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.12;
      ctx.fill(p.shape.body);

      // Чіткі контури та внутрішні лінії
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round'; // Запобігає гострим піксельним зрізам на кінцях ліній
      ctx.lineJoin = 'round'; // Згладжує кути на стиках контурів

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

  confettiTimeoutId = setTimeout(stopConfetti, 10000);
}