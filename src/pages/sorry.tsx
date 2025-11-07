import { useEffect, useRef } from "react";
import "./sorry.css";

export default function SorryPage() {
  const emojis = ["🥺", "💔", "😢", "😭", "❤️", "💖", "😞", "🫶", "😿", "💘"];
  const emojiRefs = useRef<HTMLDivElement[]>([]);

  const randomPosition = () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 6}s`,
    fontSize: `${18 + Math.random() * 28}px`,
  });

  useEffect(() => {
    emojiRefs.current.forEach((el) => {
      if (el) Object.assign(el.style, randomPosition());
    });
  }, []);

  return (
    <div className="sorry-dark">
      {/* Lietajúce emoji */}
      <div className="emoji-field">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) emojiRefs.current[i] = el;
            }}
            className="floating-emoji"
          >
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </div>
        ))}
      </div>

      {/* Moderné SVG srdce */}
      <div className="heart-container">
        <svg
          viewBox="0 0 512 512"
          className="heart-outline"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256 464C256 464 48 320 48 176C48 104.5 104.5 48 176 48C212.6 48 247.1 66.2 270.1 94.8C293.1 66.2 327.4 48 364 48C435.5 48 492 104.5 492 176C492 320 256 464 256 464Z"
          />
        </svg>

        <div className="heart-text">
          <h1>Prepáč mamka ❤️</h1>
          <p className="subtext">Nabudúce ich prehodím do sušičky </p>
        </div>
      </div>
    </div>
  );
}
