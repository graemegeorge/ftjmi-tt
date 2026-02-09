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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return date.toLocaleString();
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
                <TableHead className="text-right">Delete</TableHead>
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
      </CardContent>
      <AlertDialog
        open={Boolean(jobPendingDelete)}
        onOpenChange={(open) => !open && setJobPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
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
    </Card>
  );
}
