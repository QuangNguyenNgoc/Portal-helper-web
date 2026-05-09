import { Badge } from "@/components/ui/badge";
import type { SummaryChipItem } from "../types";

export function SummaryChip({ item }: { item: SummaryChipItem }) {
  const tone =
    item.state === "prefer"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div className={`rounded-2xl border px-3 py-3 text-sm ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{item.label}</div>
        <Badge
          variant="secondary"
          className="rounded-full bg-white/80 text-inherit"
        >
          {item.count} slots
        </Badge>
      </div>
    </div>
  );
}
