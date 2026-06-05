import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { ConstraintMap, GeneratedResult, NavId, PlanId, Plan } from "../types";
import { fetchCourses, fetchConstraints } from "../../../services/plannerService";
import type { Course } from "../../../services/plannerService";

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
  
  // Data State
  courses: Course[];
  addCourse: (course: Course) => void;
  generatedPlansList: Plan[];
  setGeneratedPlansList: (plans: Plan[]) => void;
  isFetchingData: boolean;
  fetchError: string | null;
  initializeWorkspace: () => Promise<void>;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavId>("builder");
  const [constraints, setConstraints] = useState<ConstraintMap>({});
  const [activePlanId, setActivePlanId] = useState<PlanId>("A");
  const [comparedPlanIds, setComparedPlanIds] = useState<PlanId[]>(["A", "B"]);
  const [fewerStudyDays, setFewerStudyDays] = useState(true);
  const [closeGapClasses, setCloseGapClasses] = useState(true);
  const [friendMatch, setFriendMatch] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [showGeneratedBanner, setShowGeneratedBanner] = useState(false);
  const [showLabPeriods, setShowLabPeriods] = useState(false);

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [generatedPlansList, setGeneratedPlansList] = useState<Plan[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const initializeWorkspace = useCallback(async () => {
    setIsFetchingData(true);
    setFetchError(null);
    try {
      const [fetchedCourses, fetchedConstraints] = await Promise.all([
        fetchCourses(),
        fetchConstraints()
      ]);
      setCourses(fetchedCourses);
      setConstraints(fetchedConstraints);
    } catch (err) {
      setFetchError("Failed to load planner data from university systems.");
    } finally {
      setIsFetchingData(false);
    }
  }, []);

  const addCourse = useCallback((newCourse: Course) => {
    setCourses(prev => {
      if (prev.some(c => c.code === newCourse.code)) return prev;
      return [...prev, newCourse];
    });
  }, []);

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
    courses, addCourse,
    generatedPlansList, setGeneratedPlansList,
    isFetchingData,
    fetchError,
    initializeWorkspace,
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
