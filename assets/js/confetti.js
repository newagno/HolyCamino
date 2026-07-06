let confettiFrameId = null;
let confettiTimeoutId = null;

// Функція для спіралі (залишаємо вашу, але трохи згладжуємо параметри)
function spiralPathString(turns = 3, steps = 80, a = 0.5, b = 0.4) {
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
  // 1. Гребінець (Scallop) — символ Camino
  {
    // Більш плавний віялоподібний край і чіткі "вушка" внизу
    body: new Path2D('M -6,18 L -10,22 L 10,22 L 6,18 C 18,15 25,0 20,-12 C 15,-22 5,-25 0,-25 C -5,-25 -15,-22 -20,-12 C -25,0 -18,15 -6,18 Z'),
    // Радіальні лінії, що сходяться до центру основи
    lines: new Path2D('M 0,20 L 0,-25 M -4,19 L -10,-22 M 4,19 L 10,-22 M -8,15 L -18,-12 M 8,15 L 18,-12')
  },

  // 2. Спіральна мушля (Nautilus/Равлик)
  {
    body: new Path2D(spiralPathString(3, 80, 0.5, 0.4) + ' A 18,18 0 0,0 -12,-5 C -15,5 -5,15 0,0 Z'),
    lines: new Path2D(spiralPathString(3, 80, 0.5, 0.4))
  },

  // 3. Мидия / Двостулкова мушля (Mussel)
  {
    // Асиметрична краплеподібна форма
    body: new Path2D('M -18,-10 C -25,5 -10,25 10,22 C 25,20 28,-5 15,-18 C 5,-28 -10,-25 -18,-10 Z'),
    // Вигнуті лінії росту
    lines: new Path2D('M -12,-5 C -15,5 -5,15 8,12 M -6,2 C -10,12 2,20 12,18 M 0,8 C -5,18 8,24 16,21')
  },

  // 4. Конічна мушля (Auger / Cone shell)
  {
    // Довгий конус із закругленим верхом і характерним низом
    body: new Path2D('M -8,-20 C 0,-25 8,-20 6,-15 L 12,15 C 10,25 -10,25 -12,15 L -6,-15 Z'),
    // Спіральні смуги поперек конуса
    lines: new Path2D('M -7,-10 Q 0,-5 8,-10 M -9,0 Q 0,5 10,0 M -11,10 Q 0,15 11,10')
  },

  // 5. Морська зірка (Starfish)
  {
    // Згладжені, більш органічні щупальця
    body: new Path2D('M 0,-22 C 2,-15 5,-8 18,-6 C 10,0 5,5 12,18 C 5,12 0,8 -12,18 C -5,5 -10,0 -18,-6 C -5,-8 -2,-15 0,-22 Z'),
    // Центральні лінії щупалець та крапки
    lines: new Path2D('M 0,0 L 0,-20 M 0,0 L 16,-5 M 0,0 L -16,-5 M 0,0 L 10,16 M 0,0 L -10,16')
  }
];

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

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: (Math.random() * 1.0 + 0.6) * dpr, // Трохи зменшив масштаб, щоб не здавались велетенськими
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 4 * dpr,
    vy: (Math.random() * 3 + 2.5) * dpr,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 3, // Трохи сповільнив обертання
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

      // Прозорий силует (залишаємо вашу ідею, вона гарна для UI)
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.15; // Трохи яскравіше
      ctx.fill(p.shape.body);

      // Контури
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = p.color;

      // Роблю лінію обводки м'якшою
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.5;

      ctx.stroke(p.shape.body);
      ctx.stroke(p.shape.lines);

      ctx.restore();

      p.x += p.vx + Math.sin(p.y / 40) * 0.8; // Трохи сильніше погойдування на вітрі
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

  confettiTimeoutId = setTimeout(stopConfetti, 10000); // Зменшив до 10с (22с це занадто довго для UI анімації)
}