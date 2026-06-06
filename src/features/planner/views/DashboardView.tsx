import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Filter,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ConstraintStats } from "../types";
import { usePlannerStore } from "../store/PlannerContext";

export function DashboardView({
  constraintStats,
}: {
  constraintStats: ConstraintStats;
}) {
  const { generatedResult, setActiveNav } = usePlannerStore();
  const onGoBuilder = () => setActiveNav("builder");
  const onGoPlans = () => setActiveNav("plans");
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Portal Helper workflow
          </CardTitle>
          <CardDescription>
            Constraints are the core app state. Everything else exists to
            interpret, rank, or explain them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-900">
                Core state
              </div>
              <div className="mt-2 text-2xl font-semibold text-blue-950">
                {constraintStats.totalSlotCount} slots
              </div>
              <div className="mt-1 text-sm text-blue-800">
                {constraintStats.totalGroupCount} grouped constraints drive the
                builder, generation, and review flow.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">
                Prefer
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {constraintStats.preferSlotCount}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Ideal study windows captured as durable state.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Avoid</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {constraintStats.avoidSlotCount}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Blocked windows that prune schedule candidates first.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Filter className="h-4 w-4" /> 1. Define rules
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Build the core constraint state first by marking preferred and
                avoided windows.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="h-4 w-4" /> 2. Generate plans
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Derive ranked timetables from constraints, then let modifiers
                adjust tie-breaks and tradeoffs.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4" /> 3. Decide with backup
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Decide with confidence because each plan is explained against
                the same constraint state.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onGoBuilder}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500"
            >
              Open Schedule Builder
            </Button>
            <Button
              onClick={onGoPlans}
              variant="outline"
              className="rounded-2xl"
            >
              Open Generated Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Latest generation status
          </CardTitle>
          <CardDescription>
            Surface believable product feedback rather than a generic static
            mockup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedResult ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <CheckCircle2 className="h-4 w-4" /> Schedules generated
                successfully
              </div>
              <div className="mt-2 text-2xl font-semibold text-emerald-950">
                {generatedResult.planCount} plans from{" "}
                {generatedResult.constraintGroupCount} constraint groups
              </div>
              <div className="mt-2 text-sm text-emerald-800">
                Based on {generatedResult.constraintSlotCount} selected slots and{" "}
                {generatedResult.modifierCount} secondary modifiers.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No schedules have been generated in this session yet. Start in
              Schedule Builder and define your constraint state first.
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            The interface intentionally treats constraints as durable product
            memory, while ranking, compare, and backup strategy are derived
            views on top.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
