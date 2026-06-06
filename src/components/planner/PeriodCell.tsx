import { Check, X } from "lucide-react";
import type { BuilderTool, ConstraintState } from "../../features/planner/types";
import { slotLabel, stateTone, toolLabel, toolTone } from "../../features/planner/lib/grid";

interface PeriodCellProps {
  day: string;
  time: string;
  state: ConstraintState;
  isPreview: boolean;
  isHovered: boolean;
  tool: BuilderTool;
  onMouseDown: (day: string, time: string) => void;
  onMouseEnter: (day: string, time: string) => void;
  onMouseLeave: () => void;
}

export function PeriodCell({
  day,
  time,
  state,
  isPreview,
  isHovered,
  tool,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: PeriodCellProps) {
  const cellClass = isPreview ? toolTone(tool) : stateTone(state);
  const label = isPreview ? toolLabel(tool) : slotLabel(state);

  return (
    <button
      onMouseDown={() => onMouseDown(day, time)}
      onMouseEnter={() => onMouseEnter(day, time)}
      onMouseLeave={onMouseLeave}
      className={`relative h-[40px] border-b border-l border-slate-200 px-2 transition ${cellClass} ${isHovered ? "ring-1 ring-inset ring-slate-300" : ""}`}
    >
      <div className="flex h-full items-center justify-between rounded-xl border border-transparent px-2 text-left">
        <span className="text-[11px] font-medium opacity-80">{label}</span>
        {label === "Prefer" && <Check className="h-3.5 w-3.5 opacity-70" />}
        {label === "Avoid" && <X className="h-3.5 w-3.5 opacity-70" />}
      </div>
    </button>
  );
}
