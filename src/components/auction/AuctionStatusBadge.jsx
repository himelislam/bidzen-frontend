import { Badge } from "@/components/ui/badge";
import { isClosingSoon } from "@/utils/timeHelpers";

const STATUS_CONFIG = {
  active: { label: "Active", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  closing_soon: { label: "Closing Soon", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  flagged: { label: "Flagged", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function AuctionStatusBadge({ status, endTime }) {
  const effectiveStatus =
    status === "active" && isClosingSoon(endTime) ? "closing_soon" : status;

  const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.closed;

  return (
    <Badge className={`text-xs font-medium border-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}
