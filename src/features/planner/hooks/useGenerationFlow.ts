import { useCallback, useRef, useState } from "react";
import type { ConstraintStats, GeneratedResult, NavId } from "../types";
import { generateSchedulesAPI } from "../../../services/plannerService";
import { usePlannerStore } from "../store/PlannerContext";

export function useGenerationFlow(
  constraintStats: ConstraintStats,
  summaryItemsLength: number,
  modifierCount: number,
  onComplete: (result: GeneratedResult) => void,
  onNavigate: (nav: NavId) => void,
) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    "Ready to generate from your constraint map.",
  );

  const { constraints, courses, pinnedSectionIds, setGeneratedPlansList } = usePlannerStore();

  const start = useCallback(async () => {
    if (generating) return;
    setGenerating(true);
    setProgress(12);
    setStatusText("Validating the constraint map before searching schedule options...");

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current < 42) return Math.min(42, current + 10);
        if (current < 74) return Math.min(74, current + 7);
        if (current < 92) return Math.min(92, current + 4);
        return current;
      });
    }, 180);

    const stepTwo = window.setTimeout(() => {
      setStatusText("Searching sections against your constraints, filtering conflicts...");
    }, 520);

    try {
      // Async call to the new Service Layer
      const newPlans = await generateSchedulesAPI(constraints, courses, pinnedSectionIds);
      setGeneratedPlansList(newPlans);

      window.clearInterval(interval);
      window.clearTimeout(stepTwo);
      setProgress(100);
      setStatusText("Generation complete. Opening ranked plans...");

      onComplete({
        planCount: newPlans.length,
        constraintSlotCount: constraintStats.totalSlotCount,
        constraintGroupCount: constraintStats.totalGroupCount,
        modifierCount: summaryItemsLength + modifierCount,
      });
      onNavigate("plans");

      const settle = window.setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        setStatusText("Ready to generate from your constraint map.");
      }, 420);
      
      return () => window.clearTimeout(settle);
    } catch (err) {
      window.clearInterval(interval);
      window.clearTimeout(stepTwo);
      setGenerating(false);
      setStatusText("Error generating schedules. Please try again.");
    }
  }, [generating, constraints, courses, pinnedSectionIds, constraintStats, summaryItemsLength, modifierCount, onComplete, onNavigate, setGeneratedPlansList]);

  return { generating, progress, statusText, start };
}
