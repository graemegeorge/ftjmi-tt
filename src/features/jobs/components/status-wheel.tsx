export const STATUS_WHEEL_ITEM_META = [
  { key: "completed", label: "Completed", colorClass: "text-status-success" },
  { key: "running", label: "Running", colorClass: "text-status-info" },
  { key: "failed", label: "Failed", colorClass: "text-status-danger" }
] as const;

export type StatusWheelItem = (typeof STATUS_WHEEL_ITEM_META)[number] & { value: number };

interface StatusWheelProps {
  items: readonly StatusWheelItem[];
}

export function StatusWheel({ items }: StatusWheelProps) {
  const total = items.reduce((acc, item) => acc + item.value, 0);
  const nonZeroSegments = items.filter((item) => item.value > 0);

  const size = 112;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapSize = nonZeroSegments.length > 1 ? 10 : 0;
  const totalGap = gapSize * nonZeroSegments.length;
  const availableLength = Math.max(circumference - totalGap, 0);

  let accumulatedLength = 0;
  const segments = nonZeroSegments.map((item) => {
    const length = total > 0 ? (item.value / total) * availableLength : 0;
    const segment = {
      ...item,
      length,
      dashOffset: -accumulatedLength
    };
    accumulatedLength += length + gapSize;
    return segment;
  });

  return (
    <div className="mx-auto w-full max-w-[112px] shrink-0">
      <svg
        aria-label="Job summary chart"
        className="h-auto w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
        role="img"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="text-muted/60"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />

        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((segment) => (
            <circle
              key={segment.key}
              className={segment.colorClass}
              cx={size / 2}
              cy={size / 2}
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={segment.dashOffset}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
