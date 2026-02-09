import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobSummary } from "@/lib/types/jobs";

interface SummaryCardsProps {
  summary: JobSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Running</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-blue-700">{summary.running}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-emerald-700">{summary.completed}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-red-700">{summary.failed}</p>
        </CardContent>
      </Card>
    </section>
  );
}
