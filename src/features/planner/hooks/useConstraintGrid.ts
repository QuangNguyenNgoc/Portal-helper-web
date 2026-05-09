import { useCallback, useEffect, useMemo, useState } from "react";
import { days, timeSlots } from "../data/mock";
import { describeRange, getRangeCells } from "../lib/grid";
import type { BuilderTool, ConstraintMap, GridCell } from "../types";

export function useConstraintGrid(
  tool: BuilderTool,
  setConstraints: React.Dispatch<React.SetStateAction<ConstraintMap>>,
) {
  const [dragStart, setDragStart] = useState<GridCell | null>(null);
  const [dragCurrent, setDragCurrent] = useState<GridCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  const previewCells = useMemo(() => {
    if (!dragStart || !dragCurrent) return [];
    return getRangeCells(dragStart, dragCurrent, days, timeSlots);
  }, [dragStart, dragCurrent]);

  const previewKeys = useMemo(
    () => new Set(previewCells.map((cell) => `${cell.day}-${cell.time}`)),
    [previewCells],
  );

  const previewInfo =
    dragStart && dragCurrent
      ? describeRange(dragStart, dragCurrent, days, timeSlots)
      : null;

  // Commit selection on mouseup
  useEffect(() => {
    if (!dragStart || !dragCurrent) return;

    const handleMouseUp = () => {
      const cells = getRangeCells(dragStart, dragCurrent, days, timeSlots);
      setConstraints((prev) => {
        const next = { ...prev };
        cells.forEach((cell) => {
          const key = `${cell.day}-${cell.time}`;
          if (tool === "erase") delete next[key];
          else next[key] = tool;
        });
        return next;
      });
      setDragStart(null);
      setDragCurrent(null);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [dragStart, dragCurrent, setConstraints, tool]);

  const onCellMouseDown = useCallback(
    (day: string, time: string) => {
      const cell: GridCell = { day, time };
      setDragStart(cell);
      setDragCurrent(cell);
    },
    [],
  );

  const onCellMouseEnter = useCallback(
    (day: string, time: string) => {
      setHoveredCell({ day, time });
      if (dragStart) {
        setDragCurrent({ day, time });
      }
    },
    [dragStart],
  );

  return {
    dragStart,
    hoveredCell,
    setHoveredCell,
    previewCells,
    previewKeys,
    previewInfo,
    onCellMouseDown,
    onCellMouseEnter,
  };
}
