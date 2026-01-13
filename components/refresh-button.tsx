"use client";

import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    startTransition(() => {
      router.refresh();
      // Keep spinning for at least 500ms for visual feedback
      setTimeout(() => setIsSpinning(false), 500);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-6 w-6 text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={handleRefresh}
      disabled={isPending || isSpinning}
      title="Refresh data"
    >
      <RotateCw
        className={cn(
          "h-3.5 w-3.5",
          (isPending || isSpinning) && "animate-spin",
        )}
      />
      <span className="sr-only">Refresh</span>
    </Button>
  );
}
