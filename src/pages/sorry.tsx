// UnitTest.tsx
import React, { useState, useEffect, useRef } from "react";

// ------------------------------------------------------------------
// 🎆 FIREWORKS – FULLSCREEN CANVAS
// ------------------------------------------------------------------
function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const fireworks: any[] = [];
    const particles: any[] = [];

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    window.onresize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    class Firework {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      exploded: boolean;

      constructor() {
        this.x = random(W * 0.2, W * 0.8);
        this.y = H;
        this.targetY = random(H * 0.1, H * 0.5);
        this.speed = random(7, 12);
        this.exploded = false;
      }

      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY && !this.exploded) {
          this.exploded = true;
          explode(this.x, this.y);
        }
      }

      draw() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.x, this.y, 3, 3);
      }
    }

    function explode(x: number, y: number) {
      const count = random(40, 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          angle: random(0, Math.PI * 2),
          speed: random(1, 6),
          life: random(40, 90),
          color: `hsl(${random(0, 360)},100%,60%)`,
        });
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, W, H);

      if (Math.random() < 0.05) fireworks.push(new Firework());

      fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.exploded) fireworks.splice(i, 1);
      });

      particles.forEach((p, i) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
        p.speed *= 0.98;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);

        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9990,
        pointerEvents: "none",
      }}
    />
  );
}

// ------------------------------------------------------------------
// 📝 TEST NA JEDNOTKY
// ------------------------------------------------------------------
type Task = { question: string; answer: string };

const TASKS: Task[] = [
  { question: "1. Koľko gramov je 5 kg?", answer: "5000" },
  { question: "2. Koľko cm je 2 metre?", answer: "200" },
  { question: "3. Koľko mm je 3.5 cm?", answer: "35" },
  { question: "4. Koľko kg je 3500 g?", answer: "3.5" },
  { question: "5. Koľko metrov je 1200 cm?", answer: "12" },
];

export default function UnitTest() {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [correct, setCorrect] = useState(false);
  const [code, setCode] = useState("");

  const evaluate = () => {
    for (let i = 0; i < TASKS.length; i++) {
      if ((inputs[i] ?? "").trim() !== TASKS[i].answer) {
        alert("❌ Niektoré odpovede sú nesprávne.");
        return;
      }
    }

    setCorrect(true);
    setCode(Math.floor(1000 + Math.random() * 9000).toString());
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>Test – Premena jednotiek</h1>
      <p>Zadaj správne výsledky (len číslo).</p>

      {TASKS.map((t, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            border: "1px solid #ccc",
          }}
        >
          <b>{t.question}</b>
          <br />
          <input
            type="text"
            value={inputs[i] ?? ""}
            onChange={(e) =>
              setInputs({ ...inputs, [i]: e.target.value })
            }
            style={{
              padding: 8,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #bbb",
              width: 120,
            }}
          />
        </div>
      ))}

      <button
        onClick={evaluate}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          background: "#D32F2F",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Vyhodnotiť
      </button>

      {/* 🎆 OHŇOSTROJE + KÓD */}
      {correct && (
        <>
          <Fireworks />

          {/* Fullscreen CODE overlay */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "120px",
              fontWeight: "bold",
              color: "white",
              textShadow: "0 0 25px black",
              zIndex: 9999,
              animation: "fadeIn 1.5s ease-out",
            }}
          >
            {code}
          </div>

          {/* Fade animation */}
          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translate(-50%, -45%) scale(0.9); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            `}
          </style>
        </>
      )}
    </div>
  );
}
