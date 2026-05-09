import { useCallback, useEffect, useRef, useState } from "react";
import { generatedPlans } from "../data/mock";
import type { ConstraintStats, GeneratedResult, NavId } from "../types";

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

  // Capture stats at generation start to avoid erratic re-fires
  const statsSnapshot = useRef<{
    constraintSlotCount: number;
    constraintGroupCount: number;
    pendingRuleCount: number;
  } | null>(null);

  useEffect(() => {
    if (!generating) return;

    setProgress(12);
    setStatusText(
      "Validating the constraint map before searching schedule options...",
    );

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current < 42) return Math.min(42, current + 10);
        if (current < 74) return Math.min(74, current + 7);
        if (current < 92) return Math.min(92, current + 4);
        return current;
      });
    }, 180);

    const stepTwo = window.setTimeout(() => {
      setStatusText(
        "Searching sections against your constraints, filtering conflicts, and evaluating backup paths...",
      );
    }, 520);

    const stepThree = window.setTimeout(() => {
      setStatusText(
        "Ranking plans by fit, gap efficiency, and resilience...",
      );
    }, 980);

    const finish = window.setTimeout(() => {
      window.clearInterval(interval);
      setProgress(100);
      setStatusText("Generation complete. Opening ranked plans...");

      const snap = statsSnapshot.current;
      if (snap) {
        onComplete({
          planCount: generatedPlans.length,
          constraintSlotCount: snap.constraintSlotCount,
          constraintGroupCount: snap.constraintGroupCount,
          modifierCount: snap.pendingRuleCount - snap.constraintGroupCount,
        });
      }
      onNavigate("plans");

      const settle = window.setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        setStatusText("Ready to generate from your constraint map.");
      }, 420);

      return () => window.clearTimeout(settle);
    }, 1700);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stepTwo);
      window.clearTimeout(stepThree);
      window.clearTimeout(finish);
    };
    // Only re-fire when `generating` changes — snapshot captures the rest
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating]);

  const start = useCallback(() => {
    if (generating) return;
    const behaviorRuleCount = modifierCount;
    statsSnapshot.current = {
      constraintSlotCount: constraintStats.totalSlotCount,
      constraintGroupCount: constraintStats.totalGroupCount,
      pendingRuleCount: summaryItemsLength + behaviorRuleCount,
    };
    setGenerating(true);
  }, [generating, constraintStats, summaryItemsLength, modifierCount]);

  return { generating, progress, statusText, start };
}
