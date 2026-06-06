import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Wand2, ChevronLeft, ChevronRight } from "lucide-react";
import { navItems } from "./data/mock";
import { useGenerationFlow } from "./hooks/useGenerationFlow";
import { buildConstraintStats, buildSummary } from "./lib/grid";
import { PlannerProvider, usePlannerStore } from "./store/PlannerContext";

import { BuilderView } from "./views/BuilderView";
import { DashboardView } from "./views/DashboardView";
import { PlansView } from "./views/PlansView";
import { RightRail } from "./views/RightRail";
import { SettingsView } from "./views/SettingsView";

function PlannerShellInner() {
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Pull minimum required state from Context ──
  const {
    activeNav, setActiveNav,
    constraints,
    fewerStudyDays,
    closeGapClasses,
    friendMatch,
    setGeneratedResult,
    setShowGeneratedBanner,
    isFetchingData,
    fetchError,
    initializeWorkspace,
    generatedPlansList
  } = usePlannerStore();

  // Initialize workspace data on mount
  useEffect(() => {
    initializeWorkspace();
  }, [initializeWorkspace]);

  // ── Derived State ──
  const summaryItems = useMemo(() => buildSummary(constraints), [constraints]);
  const constraintStats = useMemo(
    () => buildConstraintStats(summaryItems),
    [summaryItems],
  );

  // ── Generation Hook ──
  const modifierCount =
    Number(fewerStudyDays) + Number(closeGapClasses) + Number(friendMatch);

  const generation = useGenerationFlow(
    constraintStats,
    summaryItems.length,
    modifierCount,
    (result) => {
      setGeneratedResult(result);
      setShowGeneratedBanner(true);
    },
    (nav) => setActiveNav(nav),
  );

  // ── Render States ──
  if (isFetchingData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 p-4">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          <span className="font-medium text-lg">Syncing university data...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 p-4">
        <div className="text-rose-600 font-medium">{fetchError}</div>
        <button onClick={() => initializeWorkspace()} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">Retry</button>
      </div>
    );
  }
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 p-4 md:flex-row md:gap-4 md:p-6">
      {/* ── Left Sidebar (collapsible, sticky) ── */}
      <Card 
        className={`mb-4 shrink-0 flex flex-col rounded-3xl border-slate-200 bg-slate-950 text-white shadow-xl transition-all duration-300 ease-in-out md:mb-0 md:h-[calc(100vh-3rem)]
        ${isExpanded ? "w-full md:w-[240px]" : "w-full md:w-[80px]"}`}
      >
        <CardContent className="flex flex-1 flex-col overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Header / Logo */}
          <div className={`mb-6 flex items-center ${isExpanded ? "gap-3 px-2" : "justify-center"} pt-2`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
              <GraduationCap className="h-5 w-5 shrink-0" />
            </div>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="min-w-0"
              >
                <div className="truncate text-lg font-semibold text-white">Portal Helper</div>
                <div className="truncate text-[11px] uppercase tracking-wider text-slate-400">
                  Constraint Planner
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-1 flex-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeNav === id;
              
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  title={!isExpanded ? label : undefined}
                  className={`flex w-full items-center rounded-2xl px-3 py-3 transition-colors ${
                    isExpanded ? "gap-3 justify-start" : "justify-center"
                  } ${
                    active
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <span className="truncate text-sm font-medium">{label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info Block (Expanded Only) */}
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 md:block"
            >
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wand2 className="h-4 w-4 shrink-0" /> Workflow
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-400">
                Build constraints in Builder, review inside Generated Plans.
              </div>
            </motion.div>
          )}

          {/* Sidebar Toggle Button */}
          <div className={`mt-4 flex ${isExpanded ? "justify-end" : "justify-center"}`}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── Main content area (fluid, takes all remaining width) ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row h-[calc(100vh-3rem)] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-w-0 flex-1 space-y-4 h-full overflow-hidden"
        >
          {activeNav === "dashboard" && (
            <DashboardView
              constraintStats={constraintStats}
            />
          )}

          {activeNav === "builder" && (
            <BuilderView
              constraintStats={constraintStats}
              generating={generation.generating}
              generationProgress={generation.progress}
              generationStatusText={generation.statusText}
              summaryItems={summaryItems}
              onGenerate={generation.start}
            />
          )}

          {activeNav === "plans" && (
            <PlansView />
          )}

          {activeNav === "settings" && (
            <SettingsView constraintStats={constraintStats} />
          )}
        </motion.div>

        {/* ── Right Rail (for non-builder views) ── */}
        {activeNav !== "builder" && activeNav !== "plans" && (
          <div className="w-full shrink-0 xl:h-full xl:w-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <RightRail
              summaryItems={summaryItems}
              constraintStats={constraintStats}
              onGenerate={generation.start}
              generating={generation.generating}
              generationProgress={generation.progress}
              generationStatusText={generation.statusText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlannerShell() {
  return (
    <PlannerProvider>
      <PlannerShellInner />
    </PlannerProvider>
  );
}
