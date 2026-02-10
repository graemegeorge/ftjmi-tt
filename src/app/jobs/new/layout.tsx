"use client";

import type { ReactNode } from "react";

import { PageShell } from "@/features/jobs/components/page-shell";
import { ArrowLeftIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function JobsNewLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <JobsNewHeader />
      {children}
    </PageShell>
  );
}

function JobsNewHeader() {
  const pathname = usePathname();

  const backHref = pathname?.endsWith("/step-3")
    ? "/jobs/new/step-2"
    : pathname?.endsWith("/step-2")
      ? "/jobs/new/step-1"
      : "/";

  return (
    <header className="flex gap-4 items-center">
      <div>
        <Link href={backHref}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </div>
      <Card className="p-2 bg-transparent" raised={false}>
        <WrenchIcon className="w-10 h-10 text-primary" color="rgb(var(--sys-brand-accent))" />
      </Card>

      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold tracking-tight">Fine-tuning</span>
        <span className="text-sm text-muted-foreground">Create a new fine-tuning job</span>
      </div>
    </header>
  );
}
