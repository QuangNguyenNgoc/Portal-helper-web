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
  selectedPrimaryPlanId: PlanId | null;
  setSelectedPrimaryPlanId: (id: PlanId | null) => void;
  selectedBackupPlanId: PlanId | null;
  setSelectedBackupPlanId: (id: PlanId | null) => void;
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
  pinnedSectionIds: string[];
  togglePinSection: (sectionId: string, courseCode: string) => void;
  clearPinnedSections: () => void;
  generatedPlansList: Plan[];
  setGeneratedPlansList: (plans: Plan[]) => void;
  isFetchingData: boolean;
  fetchError: string | null;
  initializeWorkspace: () => Promise<void>;
  hasGenerationConflict: boolean;
  setHasGenerationConflict: (val: boolean) => void;
  clearAvoidConstraints: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavId>("builder");
  const [constraints, setConstraints] = useState<ConstraintMap>({});
  const [activePlanId, setActivePlanId] = useState<PlanId>("A");
  const [comparedPlanIds, setComparedPlanIds] = useState<PlanId[]>(["A", "B"]);
  const [selectedPrimaryPlanId, setSelectedPrimaryPlanId] = useState<PlanId | null>(null);
  const [selectedBackupPlanId, setSelectedBackupPlanId] = useState<PlanId | null>(null);
  const [fewerStudyDays, setFewerStudyDays] = useState(true);
  const [closeGapClasses, setCloseGapClasses] = useState(true);
  const [friendMatch, setFriendMatch] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [showGeneratedBanner, setShowGeneratedBanner] = useState(false);
  const [showLabPeriods, setShowLabPeriods] = useState(false);

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [pinnedSectionIds, setPinnedSectionIds] = useState<string[]>([]);
  const [generatedPlansList, setGeneratedPlansList] = useState<Plan[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasGenerationConflict, setHasGenerationConflict] = useState(false);

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

  const togglePinSection = useCallback((sectionId: string, courseCode: string) => {
    setPinnedSectionIds(prev => {
      // Find if we already have this section pinned
      const isPinned = prev.includes(sectionId);
      
      // Filter out any currently pinned sections that belong to the SAME course
      // We can identify if a section belongs to a course because we created the ID as `${courseCode}-XX`
      // Or we can just filter by prefix.
      const prevWithoutCourse = prev.filter(id => !id.startsWith(`${courseCode}-`));
      
      if (isPinned) {
        // If it was already pinned, we just removed it above. Return that.
        return prevWithoutCourse;
      } else {
        // If it wasn't pinned, add it (and the others for this course are already removed)
        return [...prevWithoutCourse, sectionId];
      }
    });
  }, []);

  const clearPinnedSections = useCallback(() => setPinnedSectionIds([]), []);

  const clearAvoidConstraints = useCallback(() => {
    setConstraints(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key] === "avoid") delete next[key];
      });
      return next;
    });
  }, []);

  const value = {
    activeNav, setActiveNav,
    constraints, setConstraints,
    activePlanId, setActivePlanId,
    comparedPlanIds, setComparedPlanIds,
    selectedPrimaryPlanId, setSelectedPrimaryPlanId,
    selectedBackupPlanId, setSelectedBackupPlanId,
    fewerStudyDays, setFewerStudyDays,
    closeGapClasses, setCloseGapClasses,
    friendMatch, setFriendMatch,
    generatedResult, setGeneratedResult,
    showGeneratedBanner, setShowGeneratedBanner,
    showLabPeriods, setShowLabPeriods,
    courses, addCourse,
    pinnedSectionIds, togglePinSection, clearPinnedSections,
    generatedPlansList, setGeneratedPlansList,
    isFetchingData,
    fetchError,
    initializeWorkspace,
    hasGenerationConflict, setHasGenerationConflict,
    clearAvoidConstraints,
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
