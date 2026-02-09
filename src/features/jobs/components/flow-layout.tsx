import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { label: "Step 1", path: "/jobs/new/step-1" },
  { label: "Step 2", path: "/jobs/new/step-2" },
  { label: "Step 3", path: "/jobs/new/step-3" }
];

interface FlowLayoutProps {
  currentStep: 1 | 2 | 3;
  title: string;
  description: string;
  children: ReactNode;
}

export function FlowLayout({ currentStep, title, description, children }: FlowLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Link href="/" className="font-medium hover:text-foreground">
          Back to dashboard
        </Link>
        <span>{currentStep} / 3</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          return (
            <div
              key={step.path}
              className={
                stepNumber === currentStep
                  ? "rounded-full bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground"
                  : "rounded-full bg-muted py-1.5 text-center text-xs font-medium text-muted-foreground"
              }
            >
              {step.label}
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
