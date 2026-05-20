import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Wand2 } from "lucide-react";
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
  // ── Pull minimum required state from Context ──
  const {
    activeNav, setActiveNav,
    constraints,
    fewerStudyDays,
    closeGapClasses,
    friendMatch,
    setGeneratedResult,
    setShowGeneratedBanner
  } = usePlannerStore();

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

  // ── Render ──
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100 p-4 md:flex-row md:items-start md:gap-4 md:p-6">
      {/* ── Left Sidebar (fixed width, sticky) ── */}
      <Card className="mb-4 w-full shrink-0 rounded-3xl border-slate-200 bg-slate-950 text-white shadow-xl md:sticky md:top-6 md:mb-0 md:w-[240px]">
        <CardContent className="p-4">
          <div className="mb-6 flex items-center gap-3 px-2 pt-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">Portal Helper</div>
              <div className="truncate text-sm text-slate-400">
                Constraint-driven academic planner
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeNav === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 md:block">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Wand2 className="h-4 w-4 shrink-0" /> Constraint-first decision flow
            </div>
            <div className="mt-2 text-2xl font-semibold leading-tight">
              Constraints to Ranked Plans
            </div>
            <div className="mt-2 text-sm leading-relaxed text-slate-400">
              Build the core constraint state in Builder, then review,
              compare, and decide inside Generated Plans.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Main content area (fluid, takes all remaining width) ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-w-0 flex-1 space-y-4"
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
        {activeNav !== "builder" && (
          <div className="w-full shrink-0 xl:sticky xl:top-6 xl:w-[320px]">
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
