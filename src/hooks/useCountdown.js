import { useState, useEffect } from "react";

export function useCountdown(endTime) {
  const calculateRemaining = () => {
    const diff = Math.max(0, new Date(endTime) - new Date());
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      isExpired: diff === 0,
      totalSeconds: Math.floor(diff / 1000),
    };
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calculateRemaining()), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return remaining;
}
