import type { JobStatus, JobSummary } from "@/lib/types/jobs";
import { STATUS_WHEEL_ITEM_META, StatusWheel, type StatusWheelItem } from "./status-wheel";
import clsx from "clsx";

interface SummaryCardProps {
  summary: JobSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const items: StatusWheelItem[] = STATUS_WHEEL_ITEM_META.map((item) => ({
    ...item,
    value: summary[item.key]
  }));

  return (
    <section className="rounded-card border p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <StatusWheel items={items} />

        <div className="w-full space-y-2">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <StatusDot type={item.label.toLowerCase() as JobStatus} />
              <p className="text-sm leading-none">{item.label}</p>
              <span className="h-px flex-1 bg-border mt-auto" />
              <p className="text-right text-sm leading-none">
                {item.value} job{item.value > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const StatusDot = ({ type }: { type: JobStatus }) => (
  <span
    aria-hidden
    className={clsx("h-2 w-2 shrink-0 rounded-full", {
      "bg-status-success": type === "completed",
      "bg-status-info": type === "running",
      "bg-status-danger": type === "failed"
    })}
  />
);
