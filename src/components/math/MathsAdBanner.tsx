import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import backgroundAsset from "@/assets/bourso-background.jpg.asset.json";
import parrainAsset from "@/assets/bourso-parrain.png.asset.json";
import "./MathsAdBanner.css";

type Countdown = { days: string; hours: string; minutes: string; seconds: string };

const nextSaturdayAtEight = () => {
  const now = new Date();
  let days = (6 - now.getDay() + 7) % 7;
  if (days === 0 && now.getHours() >= 20) days = 7;
  const target = new Date(now);
  target.setDate(now.getDate() + days);
  target.setHours(20, 0, 0, 0);
  return target.getTime();
};

const remaining = (target: number): Countdown => {
  const distance = Math.max(0, target - Date.now());
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    days: pad(Math.floor(distance / 86_400_000)),
    hours: pad(Math.floor((distance % 86_400_000) / 3_600_000)),
    minutes: pad(Math.floor((distance % 3_600_000) / 60_000)),
    seconds: pad(Math.floor((distance % 60_000) / 1_000)),
  };
};

const MathsAdBanner = () => {
  const [visible, setVisible] = useState(true);
  const target = useMemo(nextSaturdayAtEight, []);
  const [countdown, setCountdown] = useState(() => remaining(target));

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(remaining(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (!visible) return null;

  return (
    <aside className="maths-ad" style={{ "--maths-ad-bg": `url(${backgroundAsset.url})` } as React.CSSProperties} aria-label="Offre partenaire">
      <button className="maths-ad__close" type="button" onClick={() => setVisible(false)} aria-label="Fermer la publicité"><X /></button>
      <div className="maths-ad__left">
        <div className="maths-ad__alert">Avis Important</div>
        <h2 className="maths-ad__headline">Réclamez vos <span><strong>240€</strong></span></h2>
      </div>
      <div className="maths-ad__center">
        <div className="maths-ad__timer">
          <div className="maths-ad__timer-title">LE TEMPS PRESSE. FIN DE L'OFFRE DANS :</div>
          <div className="maths-ad__countdown">
            {([
              [countdown.days, "Jours"], [countdown.hours, "Heures"],
              [countdown.minutes, "Min"], [countdown.seconds, "Sec"],
            ] as const).map(([value, label]) => (
              <div className="maths-ad__time" key={label}><b>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
        <p className="maths-ad__code">Votre code : <span>ARBO6150</span></p>
        <a href="https://bourso.arthur-borie.me" target="_blank" rel="noopener noreferrer" className="maths-ad__cta">J'exige ma prime</a>
      </div>
      <div className="maths-ad__right"><img src={parrainAsset.url} alt="Votre parrain" /></div>
    </aside>
  );
};

export default MathsAdBanner;