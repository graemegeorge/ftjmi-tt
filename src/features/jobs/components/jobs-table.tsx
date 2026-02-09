import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FineTuneJob } from "@/lib/types/jobs";

interface JobsTableProps {
  jobs: FineTuneJob[];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export function JobsTable({ jobs }: JobsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job History</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
            No jobs yet. Start by creating your first fine-tuning job.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Base model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Epochs</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>{job.baseModel}</TableCell>
                  <TableCell>
                    <Badge variant={job.status}>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{job.trainingEpochs}</TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
