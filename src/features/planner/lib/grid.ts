import type {
  BuilderTool,
  ConstraintMap,
  ConstraintMode,
  ConstraintStats,
  GridCell,
  SummaryChipItem,
} from "../types";
import { formatMinutes, toMinutes } from "./time";

// ── Visual tone helpers ──

export function stateTone(state?: ConstraintMode) {
  if (state === "prefer") return "bg-blue-100 border-blue-300 text-blue-900";
  if (state === "avoid") return "bg-rose-100 border-rose-300 text-rose-900";
  return "bg-white border-slate-200 hover:bg-slate-50";
}

export function toolTone(tool: BuilderTool) {
  if (tool === "prefer")
    return "bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-300";
  if (tool === "avoid")
    return "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300";
  return "bg-slate-100 border-slate-300 text-slate-800 ring-1 ring-slate-300";
}

export function slotLabel(state?: ConstraintMode) {
  if (state === "prefer") return "Prefer";
  if (state === "avoid") return "Avoid";
  return "Open";
}

export function toolLabel(tool: BuilderTool) {
  if (tool === "prefer") return "Prefer";
  if (tool === "avoid") return "Avoid";
  return "Erase";
}

// ── Summary / stats builders ──

export function buildSummary(constraints: ConstraintMap): SummaryChipItem[] {
  const grouped: Record<ConstraintMode, Record<string, string[]>> = {
    prefer: {},
    avoid: {},
  };

  Object.entries(constraints).forEach(([key, state]) => {
    const separator = key.lastIndexOf("-");
    const day = key.slice(0, separator);
    const time = key.slice(separator + 1);
    if (!grouped[state][day]) grouped[state][day] = [];
    grouped[state][day].push(time);
  });

  return Object.entries(grouped).flatMap(([state, value]) =>
    Object.entries(value).map(([day, times]) => {
      const sortedTimes = [...times].sort(
        (a, b) => toMinutes(a) - toMinutes(b),
      );
      return {
        id: `${state}-${day}`,
        state: state as ConstraintMode,
        label: `${state === "prefer" ? "Prefer" : "Avoid"} ${day} ${sortedTimes[0]}${sortedTimes.length > 1 ? ` → ${sortedTimes[sortedTimes.length - 1]}` : ""}`,
        count: sortedTimes.length,
      };
    }),
  );
}

export function buildConstraintStats(summaryItems: SummaryChipItem[]): ConstraintStats {
  const preferItems = summaryItems.filter((item) => item.state === "prefer");
  const avoidItems = summaryItems.filter((item) => item.state === "avoid");
  const preferSlotCount = preferItems.reduce((sum, item) => sum + item.count, 0);
  const avoidSlotCount = avoidItems.reduce((sum, item) => sum + item.count, 0);

  return {
    preferSlotCount,
    avoidSlotCount,
    preferGroupCount: preferItems.length,
    avoidGroupCount: avoidItems.length,
    totalSlotCount: preferSlotCount + avoidSlotCount,
    totalGroupCount: summaryItems.length,
  };
}

// ── Grid range helpers ──

export function getRangeCells(
  start: GridCell,
  end: GridCell,
  days: string[],
  timeSlots: string[],
): GridCell[] {
  const startDayIndex = days.indexOf(start.day);
  const endDayIndex = days.indexOf(end.day);
  const startTimeIndex = timeSlots.indexOf(start.time);
  const endTimeIndex = timeSlots.indexOf(end.time);

  const minDay = Math.min(startDayIndex, endDayIndex);
  const maxDay = Math.max(startDayIndex, endDayIndex);
  const minTime = Math.min(startTimeIndex, endTimeIndex);
  const maxTime = Math.max(startTimeIndex, endTimeIndex);

  const cells: GridCell[] = [];
  for (let dayIndex = minDay; dayIndex <= maxDay; dayIndex += 1) {
    for (let timeIndex = minTime; timeIndex <= maxTime; timeIndex += 1) {
      cells.push({ day: days[dayIndex], time: timeSlots[timeIndex] });
    }
  }
  return cells;
}

export function describeRange(
  start: GridCell,
  end: GridCell,
  days: string[],
  timeSlots: string[],
) {
  const cells = getRangeCells(start, end, days, timeSlots);
  const dayIndices = cells.map((cell) => days.indexOf(cell.day));
  const timeIndices = cells.map((cell) => timeSlots.indexOf(cell.time));
  const firstDay = days[Math.min(...dayIndices)];
  const lastDay = days[Math.max(...dayIndices)];
  const firstTime = timeSlots[Math.min(...timeIndices)];
  const lastTimeIndex = Math.max(...timeIndices);
  const lastTime = formatMinutes(toMinutes(timeSlots[lastTimeIndex]) + 30);

  return {
    label: `${firstDay}${firstDay !== lastDay ? ` → ${lastDay}` : ""} · ${firstTime}–${lastTime}`,
    count: cells.length,
  };
}
