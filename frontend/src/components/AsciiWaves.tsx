import { useEffect, useRef } from "react";

const CHARS = " .:-=+*#%@";

export default function AsciiWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationId = 0;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseActive = false;

    const spacingX = 12;
    const spacingY = 18;
    const fontSize = 13;
    const radius = 240;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      mouseActive = true;
    };

    const handlePointerLeave = () => {
      mouseActive = false;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "middle";

      for (let y = 9; y < height; y += spacingY) {
        for (let x = 0; x < width; x += spacingX) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const influence =
            mouseActive && distance < radius
              ? Math.pow(1 - distance / radius, 2)
              : 0;

          const baseWave =
            Math.sin(x * 0.018 + time) *
            Math.cos(y * 0.025 - time * 0.8);

          const ripple =
            mouseActive && distance < radius
              ? Math.sin(distance * 0.065 - time * 4) * influence
              : 0;

          const displacement = ripple * 2.2;
          const wave = baseWave + ripple * 1.5;

          const intensity = Math.min(
            1,
            0.12 + Math.abs(wave) * 0.32 + influence * 0.7,
          );

          const charIndex = Math.min(
            CHARS.length - 1,
            Math.floor(intensity * (CHARS.length - 1)),
          );

          const character = CHARS[charIndex];

          if (character === " ") continue;

          ctx.globalAlpha = 0.18 + intensity * 0.65;
          ctx.fillStyle = "#ffffff";

          ctx.fillText(
            character,
            x + displacement * (dx / (distance || 1)),
            y + displacement * (dy / (distance || 1)),
          );
        }
      }

      ctx.globalAlpha = 1;
      time += 0.025;
      animationId = requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
