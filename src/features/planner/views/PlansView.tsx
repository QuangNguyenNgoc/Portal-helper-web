import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRightLeft,
  CheckCircle2,
  ShieldCheck,
  Target,
} from "lucide-react";
import { MiniWeek } from "../components/MiniWeek";
import { ScoreBar } from "../components/ScoreBar";
import { days } from "../data/mock";
import { usePlanInteractions } from "../hooks/usePlanInteractions";
import { StatusBanner } from "../../../components/planner/StatusBanner";
import { PlanList } from "../../../components/planner/PlanList";
import { PlanComparisonTable } from "../../../components/planner/PlanComparisonTable";
import { DecisionSummary } from "../../../components/planner/DecisionSummary";
import { usePlannerStore } from "../store/PlannerContext";

export function PlansView() {
  const {
    activePlan,
    activePlanId,
    setActivePlanId,
    comparedPlans,
    comparedPlanIds,
    compareColumns,
    compareHint,
    toggleCompare,
    compareLimitReached,
    generatedResult,
    showGeneratedBanner,
    dismissBanner,
  } = usePlanInteractions();
  
  const { generatedPlansList } = usePlannerStore();

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-4">
        <StatusBanner
          generatedResult={generatedResult}
          showGeneratedBanner={showGeneratedBanner}
          onDismiss={dismissBanner}
        />

        <PlanList
          plans={generatedPlansList}
          activePlanId={activePlanId}
          comparedPlanIds={comparedPlanIds}
          onOpen={setActivePlanId}
          onToggleCompare={toggleCompare}
          compareLimitReached={compareLimitReached}
          compareHint={compareHint}
        />

      </div>

      <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">
                  Generated Plans
                </CardTitle>
                <CardDescription>
                  A review workspace where ranked plans, compare state, and
                  decision support all stay anchored to the same constraint
                  state.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-slate-100 text-slate-800 hover:bg-slate-100">
                  Active plan: {activePlan.name}
                </Badge>
                <Badge className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Compare: {comparedPlanIds.length}/3
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="detail" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-100">
                <TabsTrigger value="detail" className="rounded-xl">
                  Plan detail
                </TabsTrigger>
                <TabsTrigger value="compare" className="rounded-xl">
                  Compare
                </TabsTrigger>
                <TabsTrigger value="courses" className="rounded-xl">
                  Course fit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="detail" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">
                            {activePlan.name}
                          </CardTitle>
                          <CardDescription>
                            {activePlan.summary}
                          </CardDescription>
                        </div>
                        <Badge className="rounded-full bg-slate-900 text-white hover:bg-slate-900">
                          Score {activePlan.score}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-white p-4">
                          <div className="text-slate-500">Study days</div>
                          <div className="mt-2 text-xl font-semibold text-slate-900">
                            {activePlan.studyDays}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <div className="text-slate-500">Gap profile</div>
                          <div className="mt-2 text-xl font-semibold text-slate-900">
                            {activePlan.gapProfile}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <div className="text-slate-500">
                            Seat availability
                          </div>
                          <div className="mt-2 text-xl font-semibold text-slate-900">
                            {activePlan.seatAvailability}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <div className="text-slate-500">Friend match</div>
                          <div className="mt-2 text-xl font-semibold text-slate-900">
                            {activePlan.friendMatch}%
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
                          <ShieldCheck className="h-4 w-4" /> Why this plan
                          ranks here
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          {activePlan.why.map((point) => (
                            <div
                              key={point}
                              className="rounded-xl bg-slate-50 px-3 py-3"
                            >
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
                          <Target className="h-4 w-4" /> Score explanation
                        </div>
                        <div className="space-y-4">
                          <ScoreBar
                            label="Constraint fit"
                            value={activePlan.scoreBreakdown.constraintFit}
                          />
                          <ScoreBar
                            label="Gap efficiency"
                            value={activePlan.scoreBreakdown.gapEfficiency}
                          />
                          <ScoreBar
                            label="Daily balance"
                            value={activePlan.scoreBreakdown.dailyBalance}
                          />
                          <ScoreBar
                            label="Backup resilience"
                            value={activePlan.scoreBreakdown.backupResilience}
                          />
                          <ScoreBar
                            label="Friend matching"
                            value={activePlan.scoreBreakdown.friendMatching}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        Weekly timetable
                      </CardTitle>
                      <CardDescription>
                        Active plan opened in detail for dense but readable
                        review.
                      </CardDescription>
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
                            {(activePlan.schedule[day] || []).length > 0 ? (
                              activePlan.schedule[day].map((item) => (
                                <div
                                  key={item.title + item.time}
                                  className={`rounded-xl px-3 py-3 text-sm ${item.tone}`}
                                >
                                  <div className="font-medium">
                                    {item.title}
                                  </div>
                                  <div className="mt-1 text-xs opacity-80">
                                    {item.time}
                                  </div>
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
                </div>
              </TabsContent>

              <TabsContent value="compare" className="space-y-4">
                <PlanComparisonTable
                  comparedPlans={comparedPlans}
                  compareColumns={compareColumns}
                />
              </TabsContent>

              <TabsContent
                value="courses"
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Courses in {activePlan.name}
                    </CardTitle>
                    <CardDescription>
                      Readable summary of the active plan at course level.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    {activePlan.courses.map((course) => (
                      <div
                        key={course}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        {course}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Daily load + gap analysis
                    </CardTitle>
                    <CardDescription>
                      Explain the tradeoffs rather than leaving the user to
                      infer them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    {activePlan.notes.map((note) => (
                      <div
                        key={note}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        {note}
                      </div>
                    ))}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                      This section stays intentionally explanatory because the
                      product should help students decide, not just display raw
                      schedules.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="relative hidden xl:block">
          <DecisionSummary />
        </div>
      </div>
      
      <div className="xl:hidden">
         <DecisionSummary />
      </div>
    </div>
  );
}
