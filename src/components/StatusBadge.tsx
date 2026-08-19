import { AlertTriangle, CheckCircle2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusStatus } from "@/services/transport";
import { statusLabel } from "@/lib/transit-format";

const MAP = {
  on_time: {
    icon: CheckCircle2,
    className: "bg-success-soft text-success border-success/25",
  },
  delayed: {
    icon: AlertTriangle,
    className: "bg-warning-soft text-warning border-warning/30",
  },
  offline: {
    icon: WifiOff,
    className: "bg-danger-soft text-danger border-danger/25",
  },
} as const;

interface StatusBadgeProps {
  status: BusStatus;
  delayMinutes?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Status is always communicated with colour + icon + text. */
export function StatusBadge({ status, delayMinutes = 0, size = "sm", className }: StatusBadgeProps) {
  const { icon: Icon, className: tone } = MAP[status];
  const label = statusLabel(status, delayMinutes);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        tone,
        className,
      )}
    >
      <Icon aria-hidden className={size === "sm" ? "size-3.5" : "size-4"} />
      <span>{label}</span>
    </span>
  );
}
