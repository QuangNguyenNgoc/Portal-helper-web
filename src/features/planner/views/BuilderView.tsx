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
import { BuilderPreferenceCard } from "../components/BuilderPreferenceCard";
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
        <div className="space-y-8 pr-2">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Course selection</h2>
                <p className="text-sm text-slate-500 mt-1">Add target courses before generating schedules.</p>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                Total: {totalCredits} credits
              </Badge>
            </div>
            <div className="space-y-3">
              {courses.map((course) => (
                <CourseCard key={course.code} {...course} />
              ))}
              <Button
                variant="outline"
                className="w-full rounded-2xl border-dashed bg-transparent hover:bg-slate-50"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add another course
              </Button>
            </div>
          </div>
          
          <CourseSearchModal 
            isOpen={isSearchModalOpen} 
            onClose={() => setIsSearchModalOpen(false)} 
          />

          <div className="pt-6 border-t border-slate-200/60 opacity-80 transition-opacity hover:opacity-100">
             <div className="mb-4">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Secondary Scoring</h3>
             </div>
             <BuilderPreferenceCard {...modifiers} />
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

        {/* ── Middle Column (Canvas or Conflict Fallback) ── */}
        <div className={`min-w-0 overflow-hidden ${generating ? "pointer-events-none opacity-70" : ""}`}>
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
