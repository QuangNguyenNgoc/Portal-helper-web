import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanListCard } from "../../features/planner/components/PlanListCard";
import type { Plan, PlanId } from "../../features/planner/types";
import { usePlannerStore } from "../../features/planner/store/PlannerContext";

interface PlanListProps {
  plans: Plan[];
  activePlanId: PlanId;
  comparedPlanIds: PlanId[];
  onOpen: (id: PlanId) => void;
  onToggleCompare: (id: PlanId) => void;
  compareLimitReached: boolean;
  compareHint: string | null;
}

export function PlanList({
  plans,
  activePlanId,
  comparedPlanIds,
  onOpen,
  onToggleCompare,
  compareLimitReached,
  compareHint,
}: PlanListProps) {
  const { selectedPrimaryPlanId, setSelectedPrimaryPlanId } = usePlannerStore();

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-slate-900">
              Ranked plan list
            </CardTitle>
            <CardDescription>
              Open a plan in detail, then optionally add it to side-by-side
              comparison.
            </CardDescription>
          </div>
          <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
            {comparedPlanIds.length} in compare
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {compareHint && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {compareHint}
          </div>
        )}

        {plans.map((plan) => (
          <PlanListCard
            key={plan.id}
            plan={plan}
            active={activePlanId === plan.id}
            compared={comparedPlanIds.includes(plan.id)}
            isPrimary={selectedPrimaryPlanId === plan.id}
            onOpen={() => onOpen(plan.id)}
            onToggleCompare={() => onToggleCompare(plan.id)}
            onSelectPrimary={() => setSelectedPrimaryPlanId(plan.id)}
            compareLimitReached={compareLimitReached}
          />
        ))}
      </CardContent>
    </Card>
  );
}
