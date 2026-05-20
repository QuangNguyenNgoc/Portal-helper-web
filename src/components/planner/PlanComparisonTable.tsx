import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";
import { CompareRow } from "../../features/planner/components/CompareRow";
import { MiniWeek } from "../../features/planner/components/MiniWeek";
import type { Plan } from "../../features/planner/types";

interface PlanComparisonTableProps {
  comparedPlans: Plan[];
  compareColumns: (Plan | undefined)[];
}

export function PlanComparisonTable({
  comparedPlans,
  compareColumns,
}: PlanComparisonTableProps) {
  if (comparedPlans.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <ArrowRightLeft className="h-5 w-5 text-slate-700" />
          </div>
          <div className="mt-4 text-lg font-semibold text-slate-900">
            No plans selected for compare
          </div>
          <div className="mt-2 max-w-md text-sm text-slate-500">
            Use the ranked plan list to add up to three plans. Compare stays
            inside Generated Plans because reviewing and deciding belong to
            the same workspace.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        Comparing {comparedPlans.length} plan
        {comparedPlans.length > 1 ? "s" : ""}. The active plan can be
        different from the compare set, so users can open one plan in detail
        while benchmarking several candidates side by side.
      </div>

      <div
        className={`grid gap-4 ${comparedPlans.length >= 3 ? "xl:grid-cols-3" : comparedPlans.length === 2 ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}
      >
        {comparedPlans.map((plan) => (
          <MiniWeek key={plan.id} plan={plan} />
        ))}
      </div>

      <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Match score breakdown</CardTitle>
          <CardDescription>
            Direct comparison for decision-making, not just raw timetable
            viewing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 overflow-x-auto">
          <div className="grid grid-cols-[180px_repeat(3,minmax(180px,1fr))] gap-3 px-1 text-sm font-medium text-slate-500">
            <div>Metric</div>
            {compareColumns.map((plan, index) => (
              <div key={index}>{plan ? plan.name : ""}</div>
            ))}
          </div>
          <CompareRow
            label="Total score"
            values={compareColumns.map((plan) => (plan ? `${plan.score}` : ""))}
          />
          <CompareRow
            label="Study days"
            values={compareColumns.map((plan) =>
              plan ? `${plan.studyDays} days` : "",
            )}
          />
          <CompareRow
            label="Gap profile"
            values={compareColumns.map((plan) =>
              plan ? plan.gapProfile : "",
            )}
          />
          <CompareRow
            label="Daily load"
            values={compareColumns.map((plan) =>
              plan ? plan.dailyLoad : "",
            )}
          />
          <CompareRow
            label="Seat risk"
            values={compareColumns.map((plan) =>
              plan ? plan.seatRisk : "",
            )}
          />
          <CompareRow
            label="Friend match"
            values={compareColumns.map((plan) =>
              plan ? `${plan.friendMatch}%` : "",
            )}
          />
          <CompareRow
            label="Backup readiness"
            values={compareColumns.map((plan) => (plan ? plan.backup : ""))}
          />
          <CompareRow
            label="Conflict status"
            values={compareColumns.map((plan) =>
              plan ? plan.conflict : "",
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
