import { useState } from "react";
import { usePlannerStore } from "../store/PlannerContext";
import { useConstraintGrid } from "./useConstraintGrid";
import type { BuilderTool } from "../types";

export function useBuilderInteractions() {
  const {
    constraints,
    setConstraints,
    fewerStudyDays,
    setFewerStudyDays,
    closeGapClasses,
    setCloseGapClasses,
    friendMatch,
    setFriendMatch,
    showLabPeriods,
    setShowLabPeriods,
  } = usePlannerStore();

  const [tool, setTool] = useState<BuilderTool>("prefer");
  const gridInteraction = useConstraintGrid(tool, setConstraints);

  const applyPreset = (presetId: string) => {
    const next = { ...constraints };

    if (presetId === "morning") {
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
        ['1', '2', '2.5', '4', '5'].forEach((time) => {
          next[`${day}-${time}`] = "avoid";
        });
      });
      setConstraints(next);
      return;
    }

    if (presetId === "afternoon") {
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
        ['6', '7', '8', '8.5', '9', '10'].forEach((time) => {
          next[`${day}-${time}`] = "avoid";
        });
      });
      setConstraints(next);
      return;
    }

    if (presetId === "days") {
      setFewerStudyDays(true);
      return;
    }

    if (presetId === "gaps") {
      setCloseGapClasses(true);
    }
  };

  return {
    tool,
    setTool,
    applyPreset,
    gridInteraction,
    constraints,
    modifiers: {
      fewerStudyDays,
      setFewerStudyDays,
      closeGapClasses,
      setCloseGapClasses,
      friendMatch,
      setFriendMatch,
    },
    showLabPeriods,
    toggleShowLabPeriods: (val: boolean) => setShowLabPeriods(val),
  };
}
