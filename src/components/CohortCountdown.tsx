import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TIME_ZONE = "America/Montevideo";

const weekdayMap: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const getMontevideoParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || "0", 10);
  return {
    weekday: parts.find((p) => p.type === "weekday")?.value || "",
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
};

const setMontevideoTime = (date: Date, hour: number, minute: number, second: number) => {
  const adjusted = new Date(date.getTime());
  for (let i = 0; i < 3; i++) {
    const parts = getMontevideoParts(adjusted);
    const hDiff = hour - parts.hour;
    const mDiff = minute - parts.minute;
    const sDiff = second - parts.second;
    if (hDiff === 0 && mDiff === 0 && sDiff === 0) break;
    adjusted.setHours(adjusted.getHours() + hDiff);
    adjusted.setMinutes(adjusted.getMinutes() + mDiff);
    adjusted.setSeconds(adjusted.getSeconds() + sDiff);
  }
  adjusted.setMilliseconds(0);
  return adjusted;
};

const getNextWednesdayAt18UY = () => {
  const now = new Date();
  const candidate = new Date(now.getTime());

  for (let i = 0; i < 14; i++) {
    const parts = getMontevideoParts(candidate);
    const weekday = weekdayMap[parts.weekday];

    if (weekday === 3 && parts.hour < 18) {
      return setMontevideoTime(candidate, 18, 0, 0);
    }

    if (weekday !== 3) {
      const daysUntilWednesday = (3 - weekday + 7) % 7 || 7;
      candidate.setDate(candidate.getDate() + daysUntilWednesday);
      return setMontevideoTime(candidate, 18, 0, 0);
    }

    // Miércoles después de las 18:00 → avanzar al día siguiente y reintentar
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate;
};

const CohortCountdown = () => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      const { data } = await supabase
        .from("class_sessions")
        .select("class_date")
        .eq("is_active", true)
        .gte("class_date", new Date().toISOString())
        .order("class_date", { ascending: true })
        .limit(1);

      if (data && data.length > 0) {
        setTargetDate(new Date(data[0].class_date));
      } else {
        setTargetDate(getNextWednesdayAt18());
      }
      setLoading(false);
    };
    fetchClass();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (loading || (!targetDate && !expired)) return null;

  if (expired) {
    return (
      <p className="text-sm font-heading font-medium text-accent">
        ¡Inscripciones abiertas para la próxima clase!
      </p>
    );
  }

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "DÍAS" },
    { value: timeLeft.hours, label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEG" },
  ];

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex flex-col items-center justify-center rounded bg-foreground"
          style={{ width: 40, height: 48 }}
        >
          <span className="text-background text-xl font-semibold leading-none tabular-nums">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-background/50 mt-0.5">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CohortCountdown;
