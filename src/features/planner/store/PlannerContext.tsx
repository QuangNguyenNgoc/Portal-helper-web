import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ConstraintMap, GeneratedResult, NavId, PlanId } from "../types";
import { initialConstraints } from "../data/mock";

interface PlannerContextType {
  activeNav: NavId;
  setActiveNav: (nav: NavId) => void;
  constraints: ConstraintMap;
  setConstraints: React.Dispatch<React.SetStateAction<ConstraintMap>>;
  activePlanId: PlanId;
  setActivePlanId: (id: PlanId) => void;
  comparedPlanIds: PlanId[];
  setComparedPlanIds: React.Dispatch<React.SetStateAction<PlanId[]>>;
  fewerStudyDays: boolean;
  setFewerStudyDays: (val: boolean) => void;
  closeGapClasses: boolean;
  setCloseGapClasses: (val: boolean) => void;
  friendMatch: boolean;
  setFriendMatch: (val: boolean) => void;
  generatedResult: GeneratedResult | null;
  setGeneratedResult: (result: GeneratedResult | null) => void;
  showGeneratedBanner: boolean;
  setShowGeneratedBanner: (show: boolean) => void;
  showLabPeriods: boolean;
  setShowLabPeriods: (show: boolean) => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavId>("builder");
  const [constraints, setConstraints] = useState<ConstraintMap>(initialConstraints);
  const [activePlanId, setActivePlanId] = useState<PlanId>("A");
  const [comparedPlanIds, setComparedPlanIds] = useState<PlanId[]>(["A", "B"]);
  const [fewerStudyDays, setFewerStudyDays] = useState(true);
  const [closeGapClasses, setCloseGapClasses] = useState(true);
  const [friendMatch, setFriendMatch] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [showGeneratedBanner, setShowGeneratedBanner] = useState(false);
  const [showLabPeriods, setShowLabPeriods] = useState(false);

  const value = {
    activeNav, setActiveNav,
    constraints, setConstraints,
    activePlanId, setActivePlanId,
    comparedPlanIds, setComparedPlanIds,
    fewerStudyDays, setFewerStudyDays,
    closeGapClasses, setCloseGapClasses,
    friendMatch, setFriendMatch,
    generatedResult, setGeneratedResult,
    showGeneratedBanner, setShowGeneratedBanner,
    showLabPeriods, setShowLabPeriods,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlannerStore() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlannerStore must be used within a PlannerProvider");
  }
  return context;
}
