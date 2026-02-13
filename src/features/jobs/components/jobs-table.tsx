"use client";

import { useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useDeleteJobMutation } from "@/features/jobs/hooks";
import type { FineTuneJob } from "@/lib/types/jobs";

interface JobsTableProps {
  jobs: FineTuneJob[];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTimeAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(diffInSeconds, "second");

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, "minute");

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, "hour");

  const diffInDays = Math.round(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) return rtf.format(diffInDays, "day");

  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) return rtf.format(diffInMonths, "month");

  const diffInYears = Math.round(diffInDays / 365);
  return rtf.format(diffInYears, "year");
}

export function JobsTable({ jobs }: JobsTableProps) {
  const deleteJobMutation = useDeleteJobMutation();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [jobPendingDelete, setJobPendingDelete] = useState<FineTuneJob | null>(null);

  async function confirmDelete() {
    if (!jobPendingDelete) return;
    setDeletingJobId(jobPendingDelete.id);

    try {
      await deleteJobMutation.mutateAsync(jobPendingDelete.id);
      toast.success(`Deleted job "${jobPendingDelete.name}"`);
      setJobPendingDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete job");
    } finally {
      setDeletingJobId(null);
    }
  }

  return (
    <>
      {jobs.length === 0 ? (
        <div className="rounded-card border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          No jobs yet. Start by creating your first fine-tuning job.
        </div>
      ) : (
        <Table className="table-fixed">
          <colgroup>
            <col />
            <col className="w-32 hidden sm:table-column" />
            <col className="w-30" />
            <col className="w-15" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex w-full items-center justify-between rounded-md bg-muted">
                    <span className="min-w-0 flex-1 truncate px-2 text-center lg:text-left font-mono text-xs">
                      {job.id}
                    </span>
                    <CopyToClipboardButton
                      ariaLabel={`Copy job id ${job.id}`}
                      className="text-muted-foreground"
                      successMessage="Job id copied to clipboard"
                      value={job.id}
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="space-y-0.5">
                    <p className="text-sm">{formatDate(job.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(job.createdAt)}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={job.status}>{job.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    aria-label={`Delete ${job.name}`}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={deletingJobId === job.id}
                    onClick={() => setJobPendingDelete(job)}
                    size="sm"
                    title="Delete job"
                    variant="ghost"
                  >
                    {deletingJobId === job.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={Boolean(jobPendingDelete)}
        onOpenChange={(open) => !open && setJobPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="gap-4">
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>
              {jobPendingDelete
                ? `Are you sure you want to delete "${jobPendingDelete.name}"? This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingJobId)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={Boolean(deletingJobId)} onClick={confirmDelete}>
              {deletingJobId ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Delete job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
