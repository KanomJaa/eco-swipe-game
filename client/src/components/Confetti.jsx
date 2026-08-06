import { useEffect, useRef } from 'react';

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#67e8f9', '#fb7185'];
    const pieces = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.4,
      w: Math.random() * 7 + 4,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2.5,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 5,
    }));

    const start = Date.now();
    let animId;

    function render() {
      const elapsed = Date.now() - start;
      if (elapsed > 2500) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[150] pointer-events-none"
    />
  );
}
