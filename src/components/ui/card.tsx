import * as React from "react";

import { cn } from "@/lib/utils";

type CardOrientation = "vertical" | "horizontal";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: CardOrientation;
}

export function Card({ className, orientation = "vertical", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border bg-card text-card-foreground shadow-panel overflow-hidden",
        orientation === "horizontal" ? "flex flex-row items-stretch" : "flex flex-col",
        className
      )}
      {...props}
    />
  );
}

type CardHeaderBackground = "transparent" | "default" | "muted";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bg?: CardHeaderBackground;
}

export function CardHeader({ className, bg = "transparent", ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-6",
        bg === "default" && "bg-card",
        bg === "muted" && "bg-muted/40",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-semibold text-2xl leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-md text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
