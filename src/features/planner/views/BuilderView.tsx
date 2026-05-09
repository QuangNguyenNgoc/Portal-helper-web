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
import { courses, days, quickPresets, timeSlots } from "../data/mock";
import { useConstraintGrid } from "../hooks/useConstraintGrid";
import { slotLabel, stateTone, toolLabel, toolTone } from "../lib/grid";
import { isOnHour } from "../lib/time";
import type { BuilderTool, ConstraintMap, ConstraintStats } from "../types";

export function BuilderView({
  constraints,
  constraintStats,
  setConstraints,
  generating,
  generationProgress,
  generationStatusText,
  fewerStudyDays,
  setFewerStudyDays,
  closeGapClasses,
  setCloseGapClasses,
  friendMatch,
  setFriendMatch,
}: {
  constraints: ConstraintMap;
  constraintStats: ConstraintStats;
  setConstraints: React.Dispatch<React.SetStateAction<ConstraintMap>>;
  generating: boolean;
  generationProgress: number;
  generationStatusText: string;
  fewerStudyDays: boolean;
  setFewerStudyDays: (value: boolean) => void;
  closeGapClasses: boolean;
  setCloseGapClasses: (value: boolean) => void;
  friendMatch: boolean;
  setFriendMatch: (value: boolean) => void;
}) {
  // tool state is interaction-level, owned by this view
  const [tool, setTool] = useState<BuilderTool>("prefer");

  const {
    hoveredCell,
    setHoveredCell,
    previewKeys,
    previewInfo,
    onCellMouseDown,
    onCellMouseEnter,
  } = useConstraintGrid(tool, setConstraints);

  const applyPreset = (presetId: string) => {
    const next = { ...constraints };

    if (presetId === "early") {
      ["Mon", "Tue", "Wed", "Thu", "Fri"].forEach((day) => {
        ["07:00", "07:30", "08:00", "08:30"].forEach((time) => {
          next[`${day}-${time}`] = "avoid";
        });
      });
      setConstraints(next);
      return;
    }

    if (presetId === "fri") {
      [
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
      ].forEach((time) => {
        next[`Fri-${time}`] = "avoid";
      });
      setConstraints(next);
      return;
    }

    if (presetId === "days") {
      setFewerStudyDays(true);
      return;
    }

    if (presetId === "gaps") {
      setCloseGapClasses(true);
    }
  };

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[360px_minmax(0,1fr)]">
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

          <BuilderPreferenceCard
            fewerStudyDays={fewerStudyDays}
            setFewerStudyDays={setFewerStudyDays}
            closeGapClasses={closeGapClasses}
            setCloseGapClasses={setCloseGapClasses}
            friendMatch={friendMatch}
            setFriendMatch={setFriendMatch}
          />
        </div>

        <div className={generating ? "pointer-events-none opacity-70" : ""}>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">
                    Weekly drag-select constraint grid
                  </CardTitle>
                  <CardDescription>
                    This grid is the app's core state editor. Drag across a
                    30-minute grid to define the constraint map that every
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
                        <Check className="mr-2 h-4 w-4" /> Prefer
                      </TabsTrigger>
                      <TabsTrigger value="avoid" className="rounded-xl px-4">
                        <X className="mr-2 h-4 w-4" /> Avoid
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
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    className="rounded-full bg-white"
                    onClick={() => applyPreset(preset.id)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
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
                      ? "Clear existing selections without affecting other ranges."
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
                        ? `${hoveredCell.day} · ${hoveredCell.time}`
                        : "Hover a slot or drag to select"}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {previewInfo
                      ? `${previewInfo.count} half-hour slots ready to apply`
                      : "Multi-select ranges across days and time rows"}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Clock3 className="h-4 w-4" /> Grid fidelity
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    30-minute granularity makes the planner feel closer to real
                    registration data and avoids forcing students into
                    unrealistic hourly buckets.
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[92px_repeat(5,minmax(124px,1fr))] border-b border-slate-200 bg-slate-50">
                  <div className="px-4 py-4 text-sm font-medium text-slate-500">
                    Time
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="border-l border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="select-none">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="grid grid-cols-[92px_repeat(5,minmax(124px,1fr))]"
                    >
                      <div
                        className={`border-b border-slate-200 px-4 ${isOnHour(time) ? "py-3.5 text-sm font-medium text-slate-600" : "py-3 text-xs text-slate-400"}`}
                      >
                        {time}
                      </div>
                      {days.map((day) => {
                        const key = `${day}-${time}`;
                        const state = constraints[key];
                        const isPreview = previewKeys.has(key);
                        const isHovered =
                          !previewInfo &&
                          hoveredCell?.day === day &&
                          hoveredCell?.time === time;
                        const cellClass = isPreview
                          ? toolTone(tool)
                          : stateTone(state);
                        const label = isPreview
                          ? toolLabel(tool)
                          : slotLabel(state);

                        return (
                          <button
                            key={key}
                            onMouseDown={() => onCellMouseDown(day, time)}
                            onMouseEnter={() => onCellMouseEnter(day, time)}
                            onMouseLeave={() => {
                              setHoveredCell(null);
                            }}
                            className={`relative h-[40px] border-b border-l border-slate-200 px-2 transition ${cellClass} ${isHovered ? "ring-1 ring-inset ring-slate-300" : ""}`}
                          >
                            <div className="flex h-full items-center justify-between rounded-xl border border-transparent px-2 text-left">
                              <span className="text-[11px] font-medium opacity-80">
                                {label}
                              </span>
                              {label === "Prefer" && (
                                <Check className="h-3.5 w-3.5 opacity-70" />
                              )}
                              {label === "Avoid" && (
                                <X className="h-3.5 w-3.5 opacity-70" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-900">
                    Prefer slots
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-blue-950">
                    {constraintStats.preferSlotCount}
                  </div>
                  <div className="mt-1 text-sm text-blue-800">
                    {constraintStats.preferGroupCount} grouped preference rules
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
                    {constraintStats.avoidGroupCount} grouped blocked rules
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    Multi-select
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Drag in any direction to apply one action to a full
                    rectangular region inside the single shared constraint map.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    Erase mode
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Switch tools instead of manually repainting cells back to
                    open state while keeping the rest of the app state intact.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
