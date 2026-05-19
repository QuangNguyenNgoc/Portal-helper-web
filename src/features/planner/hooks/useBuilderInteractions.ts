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
  } = usePlannerStore();

  const [tool, setTool] = useState<BuilderTool>("prefer");
  const gridInteraction = useConstraintGrid(tool, setConstraints);

  const applyPreset = (presetId: string) => {
    const next = { ...constraints };

    if (presetId === "early") {
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((day) => {
        ["07:00", "07:30", "08:00", "08:30"].forEach((time) => {
          next[`${day}-${time}`] = "avoid";
        });
      });
      setConstraints(next);
      return;
    }

    if (presetId === "fri") {
      [
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
      ].forEach((time) => {
        next[`Fri-${time}`] = "avoid";
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
  };
}
