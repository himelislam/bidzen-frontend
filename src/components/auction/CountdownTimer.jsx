import { useCountdown } from "@/hooks/useCountdown";

export default function CountdownTimer({ endTime, startTime, status, showLabel = true }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);
  const { hours: startHours, minutes: startMinutes, seconds: startSeconds, isExpired: isStarted } = useCountdown(startTime);

  // Handle scheduled auctions
  if (status === "scheduled") {
    if (isStarted) {
      return <span className="text-sm text-green-400 font-semibold">Starting now...</span>;
    }

    const isUrgent = startHours === 0 && startMinutes < 10;
    const days = Math.floor(startHours / 24);
    const remainingHours = startHours % 24;

    return (
      <div className="flex items-center gap-1">
        {showLabel && (
          <span className="text-xs text-slate-400 mr-1">Starts in</span>
        )}
        <span className={`font-mono text-sm font-semibold tabular-nums ${isUrgent ? "text-green-400" : "text-cyan-400"}`}>
          {days > 0 && `${days}d `}
          {remainingHours > 0 && `${String(remainingHours).padStart(2, "0")}:`}
          {String(startMinutes).padStart(2, "0")}:{String(startSeconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  // Handle active auctions
  if (status === "active") {
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

  // Handle closed auctions
  if (status === "closed") {
    return <span className="text-sm text-slate-400">Auction ended</span>;
  }

  return <span className="text-sm text-slate-400">Status unknown</span>;
}
