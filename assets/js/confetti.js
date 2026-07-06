let confettiFrameId = null;
let confettiTimeoutId = null;

// 1. Scallop / Vieira — ribbed fan, single closed path (no stray subpaths)
function buildScallopPath() {
  const p = new Path2D();
  p.moveTo(-10, 0);
  // ribbed top edge (hinge side), zig-zag ridges
  const ridges = 6;
  for (let i = 0; i <= ridges; i++) {
    const x = -10 + (20 / ridges) * i;
    const y = i % 2 === 0 ? -2 : 1;
    p.lineTo(x, y);
  }
  // rounded ribbed body back to start
  p.quadraticCurveTo(10, 8, 0, 11);
  p.quadraticCurveTo(-10, 8, -10, 0);
  p.closePath();
  return p;
}

// 2. Spiral / Nautilus — coil built from decreasing arcs, explicitly closed
function buildSpiralPath() {
  const p = new Path2D();
  p.moveTo(0, 0);
  p.arc(1.5, 0, 1.5, Math.PI, 0.2 * Math.PI, false);
  p.arc(1.0, -1.0, 3.2, 0.2 * Math.PI, 1.4 * Math.PI, true);
  p.arc(-1.0, 0.5, 4.8, 1.4 * Math.PI, 0.6 * Math.PI, false);
  p.lineTo(0, 0);
  p.closePath();
  return p;
}

// 3. Clam / simple shell
function buildClamPath() {
  const p = new Path2D();
  p.moveTo(-10, 0);
  p.bezierCurveTo(-10, -8, 10, -8, 10, 0);
  p.bezierCurveTo(5, 5, -5, 5, -10, 0);
  p.closePath();
  return p;
}

// 4. Mussel — elongated teardrop
function buildMusselPath() {
  const p = new Path2D();
  p.moveTo(0, -12);
  p.bezierCurveTo(6, -8, 7, 4, 3, 10);
  p.bezierCurveTo(1, 12, -1, 12, -3, 10);
  p.bezierCurveTo(-7, 4, -6, -8, 0, -12);
  p.closePath();
  return p;
}

// 5. Starfish — 5-pointed star
function buildStarPath() {
  const p = new Path2D();
  const spikes = 5, outerR = 10, innerR = 4;
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  p.moveTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    p.lineTo(Math.cos(rot) * innerR, Math.sin(rot) * innerR);
    rot += step;
    p.lineTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
  }
  p.closePath();
  return p;
}

const SHAPES = [
  buildScallopPath(),
  buildSpiralPath(),
  buildClamPath(),
  buildMusselPath(),
  buildStarPath(),
];

/**
 * Animate Camino shell confetti on a canvas element for ~5 seconds.
 * @param {HTMLCanvasElement} canvas
 */
export function startConfetti(canvas) {
  if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
  if (confettiTimeoutId) clearTimeout(confettiTimeoutId);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.pointerEvents = 'none';

  const COLORS = ['#c8553d', '#6b7d3a', '#c9a64b', '#5a7d8c', '#faf4e3'];

  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 1.6 + 1.0,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random() * 2.5 + 1.8,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.03,
    opacity: 0.75 + Math.random() * 0.25,
    path: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));

  let isRunning = true;

  function draw() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.scale(p.r, p.r);

      ctx.fillStyle = p.color;
      ctx.fill(p.path);

      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1 / p.r;
      ctx.stroke(p.path);

      ctx.restore();

      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > canvas.height + 20) {
        p.y = -20;
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

  confettiTimeoutId = setTimeout(stopConfetti, 5000);
}