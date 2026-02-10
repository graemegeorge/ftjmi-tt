"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyToClipboardButtonProps {
  value: string;
  successMessage?: string;
  errorMessage?: string;
  ariaLabel?: string;
  className?: string;
}

async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard unavailable");
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const succeeded = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!succeeded) {
    throw new Error("Copy failed");
  }
}

export function CopyToClipboardButton({
  value,
  successMessage = "Copied to clipboard",
  errorMessage = "Failed to copy to clipboard",
  ariaLabel = "Copy to clipboard",
  className
}: CopyToClipboardButtonProps) {
  async function onCopy() {
    try {
      await copyText(value);
      toast.success(successMessage);
    } catch {
      toast.error(errorMessage);
    }
  }

  return (
    <Button
      aria-label={ariaLabel}
      className={cn("h-8 w-8 p-0", className)}
      onClick={onCopy}
      size="sm"
      title={ariaLabel}
      type="button"
      variant="ghost"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
