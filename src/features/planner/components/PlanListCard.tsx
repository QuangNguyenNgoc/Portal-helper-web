import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Plan, PlanId } from "../types";

export function PlanListCard({
  plan,
  active,
  compared,
  isPrimary,
  onOpen,
  onToggleCompare,
  onSelectPrimary,
  compareLimitReached,
}: {
  plan: Plan;
  active: boolean;
  compared: boolean;
  isPrimary: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
  onSelectPrimary: () => void;
  compareLimitReached: boolean;
}) {
  return (
    <Card
      onClick={onSelectPrimary}
      className={`rounded-3xl cursor-pointer transition-all duration-200 border bg-white ${
        isPrimary 
          ? "ring-2 ring-blue-500 shadow-lg transform -translate-y-1" 
          : active 
            ? "border-blue-200 shadow-sm bg-blue-50/30" 
            : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
      }`}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-slate-900">
                {plan.name}
              </div>
              {plan.recommended && (
                <Badge className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Recommended
                </Badge>
              )}
            </div>
            <div className="mt-1 text-sm text-slate-500">{plan.label}</div>
          </div>
          <Badge className="rounded-full bg-slate-900 text-white hover:bg-slate-900">
            {plan.score}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {isPrimary && (
            <Badge className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
              Primary Plan
            </Badge>
          )}
          {active && !isPrimary && (
            <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
              Opened in detail
            </Badge>
          )}
          {compared && (
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-white text-blue-800"
            >
              Selected for compare
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            {plan.studyDays} study days
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            Gap: {plan.gapProfile}
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            Seat risk: {plan.seatRisk}
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            Friend: {plan.friendMatch}%
          </div>
        </div>

        <div className="text-sm text-slate-500">{plan.summary}</div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className={`rounded-xl ${active ? "bg-slate-950 hover:bg-slate-800" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
          >
            {active ? "Viewing detail" : "Open detail"}
          </Button>
          <Button
            variant={compared ? "default" : "outline"}
            className={`rounded-xl ${compared ? "bg-blue-600 hover:bg-blue-500" : "bg-white hover:bg-slate-50"}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            disabled={!compared && compareLimitReached}
          >
            {compared ? "Remove from compare" : "Add to compare"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
