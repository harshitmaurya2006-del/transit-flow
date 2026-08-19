import type { ReactNode } from "react";
import { EmptyState } from "@/components/StateViews";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  caption,
  emptyTitle = "Nothing to show yet.",
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  caption: string;
  emptyTitle?: string;
  onRowClick?: (row: T) => void;
}) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-secondary/60">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-border last:border-0 ${onRowClick ? "cursor-pointer hover:bg-secondary/50" : ""}`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
