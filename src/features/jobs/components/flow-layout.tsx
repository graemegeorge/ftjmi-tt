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
    <Card className="relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <Card
        className="absolute top-6 right-6 w-fit font-mono text-muted-foreground flex flex-row items-center gap-2 rounded-sm text-sm"
        raised={false}
      >
        <CardHeader bg="muted" className="px-2 py-1 flex flex-row items-center gap-2">
          <span className="text-primary">{currentStep}</span> of 3
        </CardHeader>
      </Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
