import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { days } from "../data/mock";
import type { Plan } from "../types";

export function MiniWeek({ plan }: { plan: Plan }) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{plan.name}</CardTitle>
            <CardDescription>{plan.label}</CardDescription>
          </div>
          <Badge className="rounded-full bg-white text-slate-900 hover:bg-white">
            Score {plan.score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {days.map((day) => (
          <div
            key={day}
            className="rounded-2xl border border-slate-200 bg-white p-3"
          >
            <div className="mb-2 text-sm font-semibold text-slate-900">
              {day}
            </div>
            <div className="space-y-2">
              {(plan.schedule[day] || []).length > 0 ? (
                plan.schedule[day].map((item) => (
                  <div
                    key={item.title + item.time}
                    className={`rounded-xl px-3 py-2 text-sm ${item.tone}`}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-xs opacity-80">{item.time}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 px-3 py-5 text-center text-sm text-slate-400">
                  No classes
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
