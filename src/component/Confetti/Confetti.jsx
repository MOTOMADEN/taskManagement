import React, { useMemo } from "react";
import styles from "./Confetti.module.css";

const COLORS = ["#e0ae55", "#c8933a", "#20926c", "#e70e4f", "#0eb4e7"];

function Confetti({ show }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.2,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    [show],
  );

  if (!show) return null;

  return (
    <div className={styles.confettiWrap}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.piece}
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      <div className={styles.message}>🎉 همه‌ی تسک‌ها تکمیل شد! 🎉</div>
    </div>
  );
}

export default Confetti;