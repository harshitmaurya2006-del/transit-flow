import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-secondary text-foreground",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
} as const;

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string | undefined;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon aria-hidden className="size-5" />
        </span>
      </div>
    </div>
  );
}
