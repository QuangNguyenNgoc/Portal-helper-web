import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightLeft,
  CheckCircle2,
  ChevronRight,
  TriangleAlert,
  Users,
} from "lucide-react";
import { SummaryChip } from "../components/SummaryChip";
import { generatedPlans } from "../data/mock";
import type {
  ConstraintStats,
  NavId,
  PlanId,
  SummaryChipItem,
} from "../types";

export function RightRail({
  activeNav,
  summaryItems,
  constraintStats,
  activePlanId,
  comparedPlanIds,
  onGenerate,
  generating,
  generationProgress,
  generationStatusText,
}: {
  activeNav: NavId;
  summaryItems: SummaryChipItem[];
  constraintStats: ConstraintStats;
  activePlanId: PlanId;
  comparedPlanIds: PlanId[];
  onGenerate: () => void;
  generating: boolean;
  generationProgress: number;
  generationStatusText: string;
}) {
  const activePlan = useMemo(
    () =>
      generatedPlans.find((plan) => plan.id === activePlanId) ||
      generatedPlans[0],
    [activePlanId],
  );
  const comparedPlans = useMemo(
    () =>
      generatedPlans.filter((plan) => comparedPlanIds.includes(plan.id)),
    [comparedPlanIds],
  );

  if (activeNav === "builder") {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">
            Constraint summary
          </CardTitle>
          <CardDescription>
            Sticky overview of the app's core state while you build and
            generate ranked schedules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">
              Single source of truth
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">
              {constraintStats.totalSlotCount} slots
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {constraintStats.totalGroupCount} grouped constraints flow into
              generation, ranking, and review.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-900">Prefer</div>
              <div className="mt-2 text-xl font-semibold text-blue-950">
                {constraintStats.preferSlotCount}
              </div>
              <div className="mt-1 text-xs text-blue-800">
                {constraintStats.preferGroupCount} grouped rules
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <div className="text-sm font-medium text-rose-900">Avoid</div>
              <div className="mt-2 text-xl font-semibold text-rose-950">
                {constraintStats.avoidSlotCount}
              </div>
              <div className="mt-1 text-xs text-rose-800">
                {constraintStats.avoidGroupCount} grouped rules
              </div>
            </div>
          </div>

          {generating && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="h-2.5 w-2.5 rounded-full bg-blue-600"
                />
                Generating schedules
              </div>
              <div className="mt-2 text-sm text-blue-800">
                {generationStatusText}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-blue-900">
                <span>Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="mt-2 h-2" />
            </div>
          )}

          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {summaryItems.map((item) => (
              <SummaryChip key={item.id} item={item} />
            ))}
          </div>

          <Separator />

          <Button
            className="h-12 w-full rounded-2xl bg-blue-600 text-base font-semibold hover:bg-blue-500"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? "Generating schedules..." : "Generate schedules"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (activeNav === "plans") {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">
            Decision summary
          </CardTitle>
          <CardDescription>
            Sticky selection rail for primary and backup planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
              <CheckCircle2 className="h-4 w-4" /> Primary recommendation
            </div>
            <div className="mt-2 text-xl font-semibold text-emerald-950">
              {activePlan.name}
            </div>
            <div className="mt-1 text-sm text-emerald-800">
              {activePlan.summary}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <ArrowRightLeft className="h-4 w-4" /> Compared plans
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {comparedPlans.length > 0 ? (
                comparedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-3"
                  >
                    <span>{plan.name}</span>
                    <strong className="text-slate-900">{plan.score}</strong>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
                  No plans selected for compare yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="mb-3 flex items-center gap-2 font-medium text-slate-900">
              <Users className="h-4 w-4" /> Registration strategy
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Primary</span>
                <strong>{activePlan.name}</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Backup</span>
                <strong>
                  {comparedPlans.find((plan) => plan.id !== activePlan.id)
                    ?.name || "Plan B"}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Seat risk</span>
                <strong>{activePlan.seatRisk}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4" />
              <div>
                Keep at least one non-ideal but seat-safe fallback. The product
                should help students leave this screen with a real registration
                plan, not just a favorite timetable.
              </div>
            </div>
          </div>

          <Button className="h-12 w-full rounded-2xl bg-slate-950 text-base font-semibold hover:bg-slate-800">
            Save primary + backup
          </Button>
          <Button variant="outline" className="h-11 w-full rounded-2xl">
            Export compare snapshot
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Product rail</CardTitle>
        <CardDescription>
          Persistent context stays here across non-core views.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
          Constraints remain the core app state even outside Builder:{" "}
          {constraintStats.totalSlotCount} selected slots are currently active.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          Builder is for input. Generated Plans is for review, compare, and
          decision.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          Keep the end-to-end mental model stable by deriving every review
          surface from the same constraint state.
        </div>
      </CardContent>
    </Card>
  );
}
