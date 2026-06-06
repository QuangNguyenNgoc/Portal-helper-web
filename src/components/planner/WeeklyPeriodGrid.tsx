import { PeriodCell } from "./PeriodCell";
import type {
  BuilderTool,
  ConstraintMap,
  GridCell,
  RangeInfo,
} from "../../features/planner/types";

interface WeeklyPeriodGridProps {
  days: string[];
  visiblePeriods: string[];
  constraints: ConstraintMap;
  previewKeys: Set<string>;
  previewInfo: RangeInfo | null;
  hoveredCell: GridCell | null;
  tool: BuilderTool;
  onCellMouseDown: (day: string, time: string) => void;
  onCellMouseEnter: (day: string, time: string) => void;
  onCellMouseLeave: () => void;
}

export function WeeklyPeriodGrid({
  days,
  visiblePeriods,
  constraints,
  previewKeys,
  previewInfo,
  hoveredCell,
  tool,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseLeave,
}: WeeklyPeriodGridProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="min-w-[836px]">
        <div className="grid grid-cols-[92px_repeat(6,minmax(124px,1fr))] border-b border-slate-200 bg-slate-50">
          <div className="px-4 py-4 text-sm font-medium text-slate-500">
            Tiết
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="border-l border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="select-none">
          {visiblePeriods.map((time) => (
            <div
              key={time}
              className="grid grid-cols-[92px_repeat(6,minmax(124px,1fr))]"
            >
              <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
                {time}
              </div>
              {days.map((day) => {
                const key = `${day}-${time}`;
                const state = constraints[key];
                const isPreview = previewKeys.has(key);
                const isHovered =
                  !previewInfo &&
                  hoveredCell?.day === day &&
                  hoveredCell?.time === time;

                return (
                  <PeriodCell
                    key={key}
                    day={day}
                    time={time}
                    state={state}
                    isPreview={isPreview}
                    isHovered={isHovered}
                    tool={tool}
                    onMouseDown={onCellMouseDown}
                    onMouseEnter={onCellMouseEnter}
                    onMouseLeave={onCellMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
