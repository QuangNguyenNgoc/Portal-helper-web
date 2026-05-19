import { useMemo, useState } from "react";
import { usePlannerStore } from "../store/PlannerContext";
import { generatedPlans } from "../data/mock";
import type { PlanId } from "../types";

export function usePlanInteractions() {
  const {
    activePlanId,
    setActivePlanId,
    comparedPlanIds,
    setComparedPlanIds,
    generatedResult,
    showGeneratedBanner,
    setShowGeneratedBanner,
  } = usePlannerStore();

  const activePlan = useMemo(
    () =>
      generatedPlans.find((plan) => plan.id === activePlanId) ||
      generatedPlans[0],
    [activePlanId]
  );

  const comparedPlans = useMemo(
    () => generatedPlans.filter((plan) => comparedPlanIds.includes(plan.id)),
    [comparedPlanIds]
  );

  const compareColumns = [comparedPlans[0], comparedPlans[1], comparedPlans[2]];
  const [compareHint, setCompareHint] = useState<string | null>(null);

  const toggleCompare = (id: PlanId) => {
    setComparedPlanIds((prev) => {
      if (prev.includes(id)) {
        setCompareHint(null);
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        setCompareHint("You can compare up to 3 plans at once.");
        return prev;
      }
      setCompareHint(null);
      return [...prev, id];
    });
  };

  const compareLimitReached = comparedPlanIds.length >= 3;
  const dismissBanner = () => setShowGeneratedBanner(false);

  return {
    activePlan,
    activePlanId,
    setActivePlanId,
    comparedPlans,
    comparedPlanIds,
    compareColumns,
    compareHint,
    toggleCompare,
    compareLimitReached,
    generatedResult,
    showGeneratedBanner,
    dismissBanner,
  };
}
