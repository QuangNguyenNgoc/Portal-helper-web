import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type { GeneratedResult } from "../../features/planner/types";

interface StatusBannerProps {
  generatedResult: GeneratedResult | null;
  showGeneratedBanner: boolean;
  onDismiss: () => void;
}

export function StatusBanner({
  generatedResult,
  showGeneratedBanner,
  onDismiss,
}: StatusBannerProps) {
  if (!showGeneratedBanner || !generatedResult) return null;

  return (
    <Card className="rounded-3xl border-emerald-200 bg-emerald-50 shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
            <CheckCircle2 className="h-4 w-4" /> Generation complete
          </div>
          <div className="mt-2 text-xl font-semibold text-emerald-950">
            {generatedResult.planCount} plans generated from{" "}
            {generatedResult.constraintGroupCount} constraint groups
          </div>
          <div className="mt-1 text-sm text-emerald-800">
            Review tradeoffs derived from{" "}
            {generatedResult.constraintSlotCount} selected slots before
            locking a primary and backup.
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-emerald-200 bg-white text-emerald-900 hover:bg-white"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
}
