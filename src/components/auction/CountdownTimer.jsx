import { useCountdown } from "@/hooks/useCountdown";

export default function CountdownTimer({ endTime, showLabel = true }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);

  if (isExpired) {
    return <span className="text-sm text-slate-400">Auction ended</span>;
  }

  const isUrgent = hours === 0 && minutes < 10;

  return (
    <div className="flex items-center gap-1">
      {showLabel && (
        <span className="text-xs text-slate-400 mr-1">Ends in</span>
      )}
      <span className={`font-mono text-sm font-semibold tabular-nums ${isUrgent ? "text-amber-400" : "text-white"}`}>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
