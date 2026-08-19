import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Simple bottom sheet used for the selected-bus panel on the live map. */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="dialog"
      aria-label={title}
      aria-hidden={!open}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-[1000] transition-transform duration-300 ease-out md:inset-x-auto md:bottom-4 md:left-4 md:w-96",
        open ? "translate-y-0" : "translate-y-[110%]",
        className,
      )}
    >
      <div className="pointer-events-auto rounded-t-2xl border border-border bg-card p-4 shadow-lg md:rounded-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close bus details"
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary"
        >
          <X aria-hidden className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
