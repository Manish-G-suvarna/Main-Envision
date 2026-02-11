import "../components/entrance.css";
import samurai from "../assets/samurai.png";
import fog from "../assets/fog.png";
import cherryBlossom from "../assets/cherry-blossom.png";
import logo from "../assets/env-logo.png";
import { useEffect } from "react";

export default function Entrance({ onFinish }) {
  useEffect(() => {
    const TOTAL_DURATION = 10000; // 10 seconds
    const EXIT_DURATION = 1200;

    const exitTimer = setTimeout(() => {
      document.getElementById("entrance")?.classList.add("exit");
    }, TOTAL_DURATION - EXIT_DURATION);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, TOTAL_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div id="entrance">
    

      <img src={fog} className="fog" alt="Fog" />

      {/* Logo in the middle */}
      <img src={logo} className="entrance-logo" alt="Envision Logo" />

      <div className="samurai-light" />
      <div className="bg-text">FIGHT LIKE YOU'RE DEAD</div>
      <div className="samurai-bg" />
      <div className="samurai-glow" />

      <img src={samurai} className="samurai" alt="Samurai" />

      <div className="texture" />
      <div className="eye-glow" />

      {Array.from({ length: 8 }).map((_, i) => (
        <img
          key={i}
          src={cherryBlossom}
          className={`blossom-particle blossom-${i + 1}`}
          alt="Cherry Blossom"
        />
      ))}
    </div>
  );
}
