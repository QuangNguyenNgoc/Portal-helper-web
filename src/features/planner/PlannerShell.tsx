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
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        {/* ── Left Sidebar ── */}
        <Card className="rounded-3xl border-slate-200 bg-slate-950 text-white shadow-xl">
          <CardContent className="p-4">
            <div className="mb-6 flex items-center gap-3 px-2 pt-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">Portal Helper</div>
                <div className="text-sm text-slate-400">
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
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wand2 className="h-4 w-4" /> Constraint-first decision flow
              </div>
              <div className="mt-2 text-2xl font-semibold">
                Constraints to Ranked Plans
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Build the core constraint state in Builder, then review,
                compare, and decide inside Generated Plans.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Main Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
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
            />
          )}

          {activeNav === "plans" && (
            <PlansView />
          )}

          {activeNav === "settings" && (
            <SettingsView constraintStats={constraintStats} />
          )}
        </motion.div>

        {/* ── Right Rail ── */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <RightRail
            summaryItems={summaryItems}
            constraintStats={constraintStats}
            onGenerate={generation.start}
            generating={generation.generating}
            generationProgress={generation.progress}
            generationStatusText={generation.statusText}
          />
        </div>
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
