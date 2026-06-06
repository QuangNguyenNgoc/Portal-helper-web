import { useState } from "react";
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
import { CourseCard } from "../components/CourseCard";
import { days, quickPresets, timeSlots } from "../data/mock";
import { slotLabel, stateTone, toolLabel, toolTone } from "../lib/grid";
import { WeeklyPeriodGrid } from "../../../components/planner/WeeklyPeriodGrid";
import { GridToolbar } from "../components/GridToolbar";
import { CourseSearchModal } from "../../../components/planner/CourseSearchModal";
import { EmptyState } from "../../../components/planner/EmptyState";
import type { BuilderTool, ConstraintStats, SummaryChipItem } from "../types";
import { useBuilderInteractions } from "../hooks/useBuilderInteractions";
import { usePlannerStore } from "../store/PlannerContext";
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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { tool, setTool, applyPreset, gridInteraction, constraints, modifiers, showLabPeriods, toggleShowLabPeriods } = useBuilderInteractions();
  const { 
    courses, 
    hasGenerationConflict, 
    setHasGenerationConflict, 
    clearAvoidConstraints, 
    clearPinnedSections 
  } = usePlannerStore();
  const {
    hoveredCell,
    setHoveredCell,
    previewKeys,
    previewInfo,
    onCellMouseDown,
    onCellMouseEnter,
  } = gridInteraction;

  const visiblePeriods = showLabPeriods ? timeSlots : timeSlots.filter(p => p !== '2.5' && p !== '8.5');
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] min-w-0 space-y-4 overflow-hidden">
      {generating && (
        <Card className="shrink-0 rounded-3xl border-blue-200 bg-blue-50 shadow-sm">
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

      <div className="flex-1 min-h-0 grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_300px] overflow-hidden">
        {/* ── Left Column (Input + Output Fallback) ── */}
        <div className="flex h-full flex-col min-h-0 pr-2 pb-8">
          {/* Header, Warning & Add Button (Fixed) */}
          <div className="shrink-0 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Course selection</h2>
                <p className="text-sm text-slate-500 mt-1">Add target courses before generating schedules.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                  Total: {totalCredits} credits
                </Badge>
                {totalCredits > 22 && (
                  <span className="text-xs font-medium text-amber-600">High credit load warning</span>
                )}
              </div>
            </div>
            
            {totalCredits > 22 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-sm">
                <strong>High credit load:</strong> Finding a conflict-free schedule may be impossible. Consider dropping a course if generation fails.
              </div>
            )}

            <Button
              variant="outline"
              className="w-full rounded-2xl border-dashed bg-white hover:bg-slate-50 shadow-sm"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add another course
            </Button>
          </div>

          {/* List (Scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.code} {...course} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No courses added yet. Click above to start building.
                </div>
              )}
            </div>

            <div className="block pt-6 border-t border-slate-200/60 xl:hidden">
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
          
          <CourseSearchModal 
            isOpen={isSearchModalOpen} 
            onClose={() => setIsSearchModalOpen(false)} 
          />
        </div>

        {/* ── Middle Column (Canvas or Conflict Fallback) ── */}
        <div className={`h-full overflow-y-auto pr-2 pb-8 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${generating ? "pointer-events-none opacity-70" : ""}`}>
          {hasGenerationConflict ? (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <EmptyState 
                onReturn={() => setHasGenerationConflict(false)} 
                onClearAvoids={() => {
                  clearAvoidConstraints();
                  setHasGenerationConflict(false);
                }}
                onUnpinAll={() => {
                  clearPinnedSections();
                  setHasGenerationConflict(false);
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Constraint Canvas</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Drag across the grid to define availability. This sets the boundaries for the algorithm.
                </p>
              </div>

              <GridToolbar 
                 tool={tool} 
                 setTool={setTool} 
                 showLabPeriods={showLabPeriods} 
                 toggleShowLabPeriods={toggleShowLabPeriods} 
              />

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
            </>
          )}
        </div>

        {/* ── Right Column (Output) ── */}
        <div className="hidden h-full overflow-y-auto pr-2 pb-8 space-y-4 xl:block [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
