import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ConstraintStats } from "../types";

export function SettingsView({
  constraintStats,
}: {
  constraintStats: ConstraintStats;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Workspace preferences
          </CardTitle>
          <CardDescription>
            Desktop-first scheduling interface tuned for dense academic data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            The app's core state is still the constraint map:{" "}
            {constraintStats.totalSlotCount} selected slots across{" "}
            {constraintStats.totalGroupCount} grouped rules.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Enable seat-risk alerts and generation notifications.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Control default compare behavior and export snapshot detail level.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Choose whether GPA and exam context appear inside plan evaluation
            views.
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Product notes
          </CardTitle>
          <CardDescription>
            The shell and design language stay stable while interaction fidelity
            increases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Keep the left sidebar + main workspace + right rail shell around a
            constraint-centric interaction model.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Keep strong information hierarchy, utility-first cards, and semantic
            status color.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            Use Settings as support for the constraint engine, not as a
            distraction from the core planning flow.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
