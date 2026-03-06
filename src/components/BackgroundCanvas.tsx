import React, { useEffect, useRef } from 'react';

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let t = 0;
    let animationFrameId: number;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,.016)';
      ctx.lineWidth = 1;
      const sw = Math.floor(W / 14);
      for (let x = 0; x < W; x += sw) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      const sh = Math.floor(H / 18);
      for (let y = 0; y < H; y += sh) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      const g = ctx.createRadialGradient(W, 0, 0, W, 0, W * .65);
      g.addColorStop(0, 'rgba(232,0,29,.04)');
      g.addColorStop(1, 'rgba(232,0,29,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const sy = (t * .28) % H;
      ctx.save();
      ctx.globalAlpha = .035;
      ctx.fillStyle = 'rgba(232,0,29,1)';
      ctx.fillRect(0, sy, W, 1);
      ctx.restore();

      t++;
      animationFrameId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="bg" ref={canvasRef} />;
};
