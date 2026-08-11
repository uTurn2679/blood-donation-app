"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  startTime: string | Date;
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ startTime, durationMinutes, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timeUpTriggered = useRef(false);

  useEffect(() => {
    const startMs = new Date(startTime).getTime();
    const totalDurationMs = durationMinutes * 60 * 1000;
    const endMs = startMs + totalDurationMs;

    const updateTimer = () => {
      const now = Date.now();
      const remainingMs = endMs - now;

      if (remainingMs <= 0) {
        setSecondsLeft(0);
        if (!timeUpTriggered.current) {
          timeUpTriggered.current = true;
          onTimeUp();
        }
      } else {
        setSecondsLeft(Math.floor(remainingMs / 1000));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  if (secondsLeft === null) {
    return <div className="animate-pulse h-10 w-36 bg-gray-700/50 rounded-lg"></div>;
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft <= 300 && secondsLeft > 120; // 2 - 5 mins
  const isUrgent = secondsLeft <= 120; // < 2 mins

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div
      className={`sticky top-4 z-50 flex items-center justify-between gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 ${
        isUrgent
          ? "bg-red-950/80 border-red-500 text-red-100 animate-pulse ring-2 ring-red-500/50"
          : isWarning
          ? "bg-amber-950/80 border-amber-500 text-amber-100"
          : "bg-slate-900/90 border-emerald-500/40 text-emerald-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {isUrgent || isWarning ? (
          <AlertTriangle className={`w-5 h-5 ${isUrgent ? "text-red-400" : "text-amber-400"}`} />
        ) : (
          <Clock className="w-5 h-5 text-emerald-400" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Time Remaining</span>
      </div>
      <div className="font-mono text-2xl font-black tracking-widest">
        {formattedTime}
      </div>
    </div>
  );
}
