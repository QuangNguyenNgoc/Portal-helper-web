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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock3, Plus, X } from "lucide-react";
import { BuilderPreferenceCard } from "../components/BuilderPreferenceCard";
import { CourseCard } from "../components/CourseCard";
import { courses, days, quickPresets, timeSlots } from "../data/mock";
import { slotLabel, stateTone, toolLabel, toolTone } from "../lib/grid";
import { WeeklyPeriodGrid } from "../../../components/planner/WeeklyPeriodGrid";
import { LabToggle } from "../../../components/planner/LabToggle";
import type { BuilderTool, ConstraintStats, SummaryChipItem } from "../types";
import { useBuilderInteractions } from "../hooks/useBuilderInteractions";
import { RightRail } from "./RightRail";

interface BuilderViewProps {
  constraintStats: ConstraintStats;
  generating: boolean;
  generationProgress: number;
  generationStatusText: string;
  summaryItems: SummaryChipItem[];
  onGenerate: () => void;
}

export function BuilderView({
  constraintStats,
  generating,
  generationProgress,
  generationStatusText,
  summaryItems,
  onGenerate,
}: BuilderViewProps) {
  const { tool, setTool, applyPreset, gridInteraction, constraints, modifiers, showLabPeriods, toggleShowLabPeriods } = useBuilderInteractions();
  const {
    hoveredCell,
    setHoveredCell,
    previewKeys,
    previewInfo,
    onCellMouseDown,
    onCellMouseEnter,
  } = gridInteraction;

  const visiblePeriods = showLabPeriods ? timeSlots : timeSlots.filter(p => p !== '2.5' && p !== '8.5');

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      {generating && (
        <Card className="rounded-3xl border-blue-200 bg-blue-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
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
              </div>
              <div className="w-full max-w-[320px] space-y-2">
                <div className="flex items-center justify-between text-sm text-blue-900">
                  <span>Progress</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        {/* ── Left Column (Input + Output Fallback) ── */}
        <div className="space-y-4">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900">
                Course selection
              </CardTitle>
              <CardDescription>
                Add target courses before generating schedules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.map((course) => (
                <CourseCard key={course.code} {...course} />
              ))}
              <Button
                variant="outline"
                className="w-full rounded-2xl border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" /> Add another course
              </Button>
            </CardContent>
          </Card>

          <BuilderPreferenceCard {...modifiers} />

          <div className="block xl:hidden">
            <RightRail
              summaryItems={summaryItems}
              constraintStats={constraintStats}
              onGenerate={onGenerate}
              generating={generating}
              generationProgress={generationProgress}
              generationStatusText={generationStatusText}
            />
          </div>
        </div>

        {/* ── Middle Column (Canvas) ── */}
        <div className={`min-w-0 overflow-hidden ${generating ? "pointer-events-none opacity-70" : ""}`}>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">
                    Weekly drag-select constraint grid
                  </CardTitle>
                  <CardDescription>
                    This grid is the app's core state editor. Drag across a
                    period grid to define the constraint map that every
                    generated plan must answer to.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Tabs
                    value={tool}
                    onValueChange={(value) => setTool(value as BuilderTool)}
                    className="w-auto"
                  >
                    <TabsList className="rounded-2xl bg-slate-100 p-1">
                      <TabsTrigger value="prefer" className="rounded-xl px-4">
                        <Check className="mr-2 h-4 w-4 shrink-0" /> Prefer
                      </TabsTrigger>
                      <TabsTrigger value="avoid" className="rounded-xl px-4">
                        <X className="mr-2 h-4 w-4 shrink-0" /> Avoid
                      </TabsTrigger>
                      <TabsTrigger value="erase" className="rounded-xl px-4">
                        Erase
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Badge className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 hover:bg-blue-100">
                    Desktop-first interaction
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {quickPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="rounded-full bg-white text-xs sm:text-sm"
                      onClick={() => applyPreset(preset.id)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <LabToggle
                  showLabPeriods={showLabPeriods}
                  onToggle={toggleShowLabPeriods}
                />
              </div>

              <div className="grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-900">
                    Core app state
                  </div>
                  <div className="mt-2 text-xl font-semibold text-blue-950">
                    {constraintStats.totalSlotCount} selected slots
                  </div>
                  <div className="mt-1 text-sm text-blue-800">
                    {constraintStats.totalGroupCount} grouped rules currently
                    drive generation and plan scoring.
                  </div>
                </div>
                <div className={`rounded-2xl border p-4 ${toolTone(tool)}`}>
                  <div className="text-sm font-medium">Active tool</div>
                  <div className="mt-2 text-xl font-semibold">
                    {toolLabel(tool)}
                  </div>
                  <div className="mt-1 text-sm opacity-80">
                    {tool === "erase"
                      ? "Clear selections without affecting other ranges."
                      : `Apply ${toolLabel(tool).toLowerCase()} state to every selected slot.`}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    Selection preview
                  </div>
                  <div className="mt-2 text-base font-semibold text-slate-900">
                    {previewInfo
                      ? previewInfo.label
                      : hoveredCell
                        ? `${hoveredCell.day} · Tiết ${hoveredCell.time}`
                        : "Hover a slot or drag to select"}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {previewInfo
                      ? `${previewInfo.count} periods ready to apply`
                      : "Multi-select ranges across days and rows"}
                  </div>
                </div>
              </div>

              <div className="min-w-0 w-full">
                <WeeklyPeriodGrid
                  days={days}
                  visiblePeriods={visiblePeriods}
                  constraints={constraints}
                  previewKeys={previewKeys}
                  previewInfo={previewInfo}
                  hoveredCell={hoveredCell}
                  tool={tool}
                  onCellMouseDown={onCellMouseDown}
                  onCellMouseEnter={onCellMouseEnter}
                  onCellMouseLeave={() => setHoveredCell(null)}
                />
              </div>

              <div className="grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-900">
                    Prefer slots
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-blue-950">
                    {constraintStats.preferSlotCount}
                  </div>
                  <div className="mt-1 text-sm text-blue-800">
                    {constraintStats.preferGroupCount} preference rules
                  </div>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <div className="text-sm font-medium text-rose-900">
                    Avoid slots
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-rose-950">
                    {constraintStats.avoidSlotCount}
                  </div>
                  <div className="mt-1 text-sm text-rose-800">
                    {constraintStats.avoidGroupCount} blocked rules
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    Multi-select
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Drag in any direction to apply one action to a full
                    rectangular region.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    Erase mode
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Switch tools instead of manually repainting cells back to
                    open state.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (Output) ── */}
        <div className="hidden space-y-4 xl:block">
          <RightRail
            summaryItems={summaryItems}
            constraintStats={constraintStats}
            onGenerate={onGenerate}
            generating={generating}
            generationProgress={generationProgress}
            generationStatusText={generationStatusText}
          />
        </div>
      </div>
    </div>
  );
}
