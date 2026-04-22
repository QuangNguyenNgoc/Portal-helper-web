import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  Wand2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// ràng buộc kiểu dữ liệu cho components, state, props, function
type NavId = "dashboard" | "builder" | "plans" | "settings";
type ConstraintMode = "prefer" | "avoid";
type BuilderTool = ConstraintMode | "erase";
type ConstraintMap = Record<string, ConstraintMode>;
type PlanId = "A" | "B" | "C";

type GridCell = {
  day: string;
  time: string;
};

type SummaryChipItem = {
  id: string;
  state: ConstraintMode;
  label: string;
  count: number;
};

type PlanScheduleItem = {
  title: string;
  time: string;
  tone: string;
};

type Plan = {
  id: PlanId;
  name: string;
  label: string;
  summary: string;
  score: number;
  studyDays: number;
  gapProfile: string;
  dailyLoad: string;
  seatRisk: string;
  friendMatch: number;
  seatAvailability: string;
  conflict: string;
  backup: string;
  recommended: boolean;
  scoreBreakdown: {
    constraintFit: number;
    gapEfficiency: number;
    dailyBalance: number;
    backupResilience: number;
    friendMatching: number;
  };
  why: string[];
  courses: string[];
  notes: string[];
  schedule: Record<string, PlanScheduleItem[]>;
};

type GeneratedResult = {
  planCount: number;
  constraintSlotCount: number;
  constraintGroupCount: number;
  modifierCount: number;
};

type ConstraintStats = {
  preferSlotCount: number;
  avoidSlotCount: number;
  preferGroupCount: number;
  avoidGroupCount: number;
  totalSlotCount: number;
  totalGroupCount: number;
};

const navItems: {
  id: NavId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "builder", label: "Schedule Builder", icon: CalendarRange },
  { id: "plans", label: "Generated Plans", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function generateHalfHourSlots(startMinutes: number, endMinutes: number) {
  const result: string[] = [];
  for (let current = startMinutes; current <= endMinutes; current += 30) {
    result.push(formatMinutes(current));
  }
  return result;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isOnHour(time: string) {
  return toMinutes(time) % 60 === 0;
}

const timeSlots = generateHalfHourSlots(7 * 60, 18 * 60 + 30);

const courses = [
  { code: "CS221", name: "Data Structures", credits: 3 },
  { code: "MATH204", name: "Discrete Mathematics", credits: 3 },
  { code: "PHY102", name: "General Physics", credits: 4 },
  { code: "BUS110", name: "Academic Writing", credits: 2 },
];

const quickPresets = [
  { id: "early", label: "Avoid early mornings" },
  { id: "fri", label: "Avoid Friday afternoon" },
  { id: "days", label: "Fewer study days" },
  { id: "gaps", label: "Close-gap classes" },
];

const initialConstraints: ConstraintMap = {
  "Mon-07:00": "avoid",
  "Mon-07:30": "avoid",
  "Mon-08:00": "avoid",
  "Tue-09:00": "prefer",
  "Tue-09:30": "prefer",
  "Tue-10:00": "prefer",
  "Thu-13:00": "prefer",
  "Thu-13:30": "prefer",
  "Thu-14:00": "prefer",
  "Fri-16:00": "avoid",
  "Fri-16:30": "avoid",
  "Fri-17:00": "avoid",
};

const generatedPlans: Plan[] = [
  {
    id: "A",
    name: "Plan A",
    label: "Best overall fit",
    summary: "Balanced workload, compact week, strongest backup resilience.",
    score: 92,
    studyDays: 4,
    gapProfile: "Low",
    dailyLoad: "Balanced",
    seatRisk: "Low",
    friendMatch: 81,
    seatAvailability: "Stable",
    conflict: "No hard conflicts",
    backup: "High",
    recommended: true,
    scoreBreakdown: {
      constraintFit: 94,
      gapEfficiency: 90,
      dailyBalance: 88,
      backupResilience: 93,
      friendMatching: 81,
    },
    why: [
      "Avoids early-morning blocks while keeping core courses intact.",
      "Only one medium gap across the week.",
      "Leaves a strong backup section for CS221 if seats shift.",
    ],
    courses: [
      "CS221 • Tue / Thu 09:30–11:00",
      "MATH204 • Mon / Wed 13:00–15:00",
      "PHY102 Lab • Mon 16:00–17:30",
      "BUS110 • Fri 10:00–12:00",
    ],
    notes: [
      "Monday is the heaviest day but remains within your effort threshold.",
      "Friday stays light, which helps exam-week flexibility.",
    ],
    schedule: {
      Mon: [
        {
          title: "MATH204",
          time: "13:00–15:00",
          tone: "bg-blue-100 text-blue-900",
        },
        {
          title: "PHY102 Lab",
          time: "16:00–17:30",
          tone: "bg-amber-100 text-amber-900",
        },
      ],
      Tue: [
        {
          title: "CS221",
          time: "09:30–11:00",
          tone: "bg-emerald-100 text-emerald-900",
        },
      ],
      Wed: [
        {
          title: "MATH204",
          time: "13:00–15:00",
          tone: "bg-blue-100 text-blue-900",
        },
      ],
      Thu: [
        {
          title: "CS221",
          time: "09:30–11:00",
          tone: "bg-emerald-100 text-emerald-900",
        },
      ],
      Fri: [
        {
          title: "BUS110",
          time: "10:00–12:00",
          tone: "bg-violet-100 text-violet-900",
        },
      ],
    },
  },
  {
    id: "B",
    name: "Plan B",
    label: "Lower daily intensity",
    summary: "More forgiving day-to-day load, slightly more campus days.",
    score: 86,
    studyDays: 5,
    gapProfile: "Very low",
    dailyLoad: "Light",
    seatRisk: "Medium",
    friendMatch: 64,
    seatAvailability: "Moderate",
    conflict: "No hard conflicts",
    backup: "Medium",
    recommended: false,
    scoreBreakdown: {
      constraintFit: 89,
      gapEfficiency: 92,
      dailyBalance: 90,
      backupResilience: 72,
      friendMatching: 64,
    },
    why: [
      "Spreads workload more evenly across the week.",
      "Produces the shortest idle windows between classes.",
      "Less ideal for backup if one preferred section fills early.",
    ],
    courses: [
      "CS221 • Tue / Thu 11:00–12:30",
      "MATH204 • Mon / Wed 10:00–12:00",
      "PHY102 Lab • Fri 14:00–15:30",
      "BUS110 • Tue 15:00–17:00",
    ],
    notes: [
      "Friend overlap drops because the CS221 section changes.",
      "You gain softer day intensity but lose week compactness.",
    ],
    schedule: {
      Mon: [
        {
          title: "MATH204",
          time: "10:00–12:00",
          tone: "bg-blue-100 text-blue-900",
        },
      ],
      Tue: [
        {
          title: "CS221",
          time: "11:00–12:30",
          tone: "bg-emerald-100 text-emerald-900",
        },
        {
          title: "BUS110",
          time: "15:00–17:00",
          tone: "bg-violet-100 text-violet-900",
        },
      ],
      Wed: [
        {
          title: "MATH204",
          time: "10:00–12:00",
          tone: "bg-blue-100 text-blue-900",
        },
      ],
      Thu: [
        {
          title: "CS221",
          time: "11:00–12:30",
          tone: "bg-emerald-100 text-emerald-900",
        },
      ],
      Fri: [
        {
          title: "PHY102 Lab",
          time: "14:00–15:30",
          tone: "bg-amber-100 text-amber-900",
        },
      ],
    },
  },
  {
    id: "C",
    name: "Plan C",
    label: "Backup if sections fill",
    summary:
      "Most resilient to seat changes, but least aligned with your preferred timings.",
    score: 74,
    studyDays: 4,
    gapProfile: "Medium",
    dailyLoad: "Dense",
    seatRisk: "Low",
    friendMatch: 40,
    seatAvailability: "Strong backup",
    conflict: "One soft timing tradeoff",
    backup: "Very high",
    recommended: false,
    scoreBreakdown: {
      constraintFit: 71,
      gapEfficiency: 68,
      dailyBalance: 70,
      backupResilience: 95,
      friendMatching: 40,
    },
    why: [
      "Keeps a viable fallback path if multiple preferred sections close.",
      "Introduces one late-Friday compromise.",
      "Best used as contingency rather than first choice.",
    ],
    courses: [
      "CS221 • Mon / Wed 08:00–09:30",
      "MATH204 • Tue / Thu 13:00–15:00",
      "PHY102 Lab • Fri 16:00–17:30",
      "BUS110 • Thu 09:00–11:00",
    ],
    notes: [
      "Violates your ideal early-morning preference for CS221.",
      "Strongest insurance against registration volatility.",
    ],
    schedule: {
      Mon: [
        {
          title: "CS221",
          time: "08:00–09:30",
          tone: "bg-emerald-100 text-emerald-900",
        },
      ],
      Tue: [
        {
          title: "MATH204",
          time: "13:00–15:00",
          tone: "bg-blue-100 text-blue-900",
        },
      ],
      Wed: [
        {
          title: "CS221",
          time: "08:00–09:30",
          tone: "bg-emerald-100 text-emerald-900",
        },
      ],
      Thu: [
        {
          title: "BUS110",
          time: "09:00–11:00",
          tone: "bg-violet-100 text-violet-900",
        },
        {
          title: "MATH204",
          time: "13:00–15:00",
          tone: "bg-blue-100 text-blue-900",
        },
      ],
      Fri: [
        {
          title: "PHY102 Lab",
          time: "16:00–17:30",
          tone: "bg-amber-100 text-amber-900",
        },
      ],
    },
  },
];

function stateTone(state?: ConstraintMode) {
  if (state === "prefer") return "bg-blue-100 border-blue-300 text-blue-900";
  if (state === "avoid") return "bg-rose-100 border-rose-300 text-rose-900";
  return "bg-white border-slate-200 hover:bg-slate-50";
}

function toolTone(tool: BuilderTool) {
  if (tool === "prefer")
    return "bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-300";
  if (tool === "avoid")
    return "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300";
  return "bg-slate-100 border-slate-300 text-slate-800 ring-1 ring-slate-300";
}

function slotLabel(state?: ConstraintMode) {
  if (state === "prefer") return "Prefer";
  if (state === "avoid") return "Avoid";
  return "Open";
}

function toolLabel(tool: BuilderTool) {
  if (tool === "prefer") return "Prefer";
  if (tool === "avoid") return "Avoid";
  return "Erase";
}

function buildSummary(constraints: ConstraintMap): SummaryChipItem[] {
  const grouped: Record<ConstraintMode, Record<string, string[]>> = {
    prefer: {},
    avoid: {},
  };

  Object.entries(constraints).forEach(([key, state]) => {
    const separator = key.lastIndexOf("-");
    const day = key.slice(0, separator);
    const time = key.slice(separator + 1);
    if (!grouped[state][day]) grouped[state][day] = [];
    grouped[state][day].push(time);
  });

  return Object.entries(grouped).flatMap(([state, value]) =>
    Object.entries(value).map(([day, times]) => {
      const sortedTimes = [...times].sort(
        (a, b) => toMinutes(a) - toMinutes(b),
      );
      return {
        id: `${state}-${day}`,
        state: state as ConstraintMode,
        label: `${state === "prefer" ? "Prefer" : "Avoid"} ${day} ${sortedTimes[0]}${sortedTimes.length > 1 ? ` → ${sortedTimes[sortedTimes.length - 1]}` : ""}`,
        count: sortedTimes.length,
      };
    }),
  );
}

function buildConstraintStats(summaryItems: SummaryChipItem[]): ConstraintStats {
  const preferItems = summaryItems.filter((item) => item.state === "prefer");
  const avoidItems = summaryItems.filter((item) => item.state === "avoid");
  const preferSlotCount = preferItems.reduce((sum, item) => sum + item.count, 0);
  const avoidSlotCount = avoidItems.reduce((sum, item) => sum + item.count, 0);

  return {
    preferSlotCount,
    avoidSlotCount,
    preferGroupCount: preferItems.length,
    avoidGroupCount: avoidItems.length,
    totalSlotCount: preferSlotCount + avoidSlotCount,
    totalGroupCount: summaryItems.length,
  };
}

function getRangeCells(start: GridCell, end: GridCell): GridCell[] {
  const startDayIndex = days.indexOf(start.day);
  const endDayIndex = days.indexOf(end.day);
  const startTimeIndex = timeSlots.indexOf(start.time);
  const endTimeIndex = timeSlots.indexOf(end.time);

  const minDay = Math.min(startDayIndex, endDayIndex);
  const maxDay = Math.max(startDayIndex, endDayIndex);
  const minTime = Math.min(startTimeIndex, endTimeIndex);
  const maxTime = Math.max(startTimeIndex, endTimeIndex);

  const cells: GridCell[] = [];
  for (let dayIndex = minDay; dayIndex <= maxDay; dayIndex += 1) {
    for (let timeIndex = minTime; timeIndex <= maxTime; timeIndex += 1) {
      cells.push({ day: days[dayIndex], time: timeSlots[timeIndex] });
    }
  }
  return cells;
}

function describeRange(start: GridCell, end: GridCell) {
  const cells = getRangeCells(start, end);
  const dayIndices = cells.map((cell) => days.indexOf(cell.day));
  const timeIndices = cells.map((cell) => timeSlots.indexOf(cell.time));
  const firstDay = days[Math.min(...dayIndices)];
  const lastDay = days[Math.max(...dayIndices)];
  const firstTime = timeSlots[Math.min(...timeIndices)];
  const lastTimeIndex = Math.max(...timeIndices);
  const lastTime = formatMinutes(toMinutes(timeSlots[lastTimeIndex]) + 30);

  return {
    label: `${firstDay}${firstDay !== lastDay ? ` → ${lastDay}` : ""} · ${firstTime}–${lastTime}`,
    count: cells.length,
  };
}

function SummaryChip({ item }: { item: SummaryChipItem }) {
  const tone =
    item.state === "prefer"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div className={`rounded-2xl border px-3 py-3 text-sm ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{item.label}</div>
        <Badge
          variant="secondary"
          className="rounded-full bg-white/80 text-inherit"
        >
          {item.count} slots
        </Badge>
      </div>
    </div>
  );
}

function CourseCard({
  code,
  name,
  credits,
}: {
  code: string;
  name: string;
  credits: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-100/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{code}</div>
          <div className="mt-1 text-sm text-slate-500">{name}</div>
        </div>
        <Badge variant="outline" className="rounded-full">
          {credits} cr
        </Badge>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function BuilderPreferenceCard({
  fewerStudyDays,
  setFewerStudyDays,
  closeGapClasses,
  setCloseGapClasses,
  friendMatch,
  setFriendMatch,
}: {
  fewerStudyDays: boolean;
  setFewerStudyDays: (value: boolean) => void;
  closeGapClasses: boolean;
  setCloseGapClasses: (value: boolean) => void;
  friendMatch: boolean;
  setFriendMatch: (value: boolean) => void;
}) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-900">
          Secondary scoring modifiers
        </CardTitle>
        <CardDescription>
          These toggles refine ranking after constraints narrow the search
          space. They do not replace the constraint grid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Fewer study days
            </div>
            <div className="text-sm text-slate-500">
              Compress the week when score tradeoff is acceptable
            </div>
          </div>
          <Switch
            checked={fewerStudyDays}
            onCheckedChange={setFewerStudyDays}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Close-gap classes
            </div>
            <div className="text-sm text-slate-500">
              Prefer back-to-back sessions over long idle windows
            </div>
          </div>
          <Switch
            checked={closeGapClasses}
            onCheckedChange={setCloseGapClasses}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Friend matching
            </div>
            <div className="text-sm text-slate-500">
              Increase overlap with classmates where possible
            </div>
          </div>
          <Switch checked={friendMatch} onCheckedChange={setFriendMatch} />
        </div>
      </CardContent>
    </Card>
  );
}

function PlanListCard({
  plan,
  active,
  compared,
  onOpen,
  onToggleCompare,
  compareLimitReached,
}: {
  plan: Plan;
  active: boolean;
  compared: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
  compareLimitReached: boolean;
}) {
  return (
    <Card
      className={`rounded-3xl border shadow-sm transition ${active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}
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
          {active && (
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
            onClick={onOpen}
            className={`rounded-xl ${active ? "bg-slate-950 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-500"}`}
          >
            {active ? "Viewing detail" : "Open detail"}
          </Button>
          <Button
            variant={compared ? "default" : "outline"}
            className={`rounded-xl ${compared ? "bg-blue-600 hover:bg-blue-500" : ""}`}
            onClick={onToggleCompare}
            disabled={!compared && compareLimitReached}
          >
            {compared ? "Remove from compare" : "Add to compare"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniWeek({ plan }: { plan: Plan }) {
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

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid grid-cols-[180px_repeat(3,minmax(180px,1fr))] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <div className="font-medium text-slate-700">{label}</div>
      {values.map((value, index) => (
        <div
          key={index}
          className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600"
        >
          {value || "—"}
        </div>
      ))}
    </div>
  );
}

function DashboardView({
  generatedResult,
  constraintStats,
  onGoBuilder,
  onGoPlans,
}: {
  generatedResult: GeneratedResult | null;
  constraintStats: ConstraintStats;
  onGoBuilder: () => void;
  onGoPlans: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Portal Helper workflow
          </CardTitle>
          <CardDescription>
            Constraints are the core app state. Everything else exists to
            interpret, rank, or explain them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-900">
                Core state
              </div>
              <div className="mt-2 text-2xl font-semibold text-blue-950">
                {constraintStats.totalSlotCount} slots
              </div>
              <div className="mt-1 text-sm text-blue-800">
                {constraintStats.totalGroupCount} grouped constraints drive the
                builder, generation, and review flow.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">
                Prefer
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {constraintStats.preferSlotCount}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Ideal study windows captured as durable state.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Avoid</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {constraintStats.avoidSlotCount}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Blocked windows that prune schedule candidates first.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Filter className="h-4 w-4" /> 1. Define rules
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Build the core constraint state first by marking preferred and
                avoided windows.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="h-4 w-4" /> 2. Generate plans
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Derive ranked timetables from constraints, then let modifiers
                adjust tie-breaks and tradeoffs.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <ShieldCheck className="h-4 w-4" /> 3. Decide with backup
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Decide with confidence because each plan is explained against
                the same constraint state.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onGoBuilder}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500"
            >
              Open Schedule Builder
            </Button>
            <Button
              onClick={onGoPlans}
              variant="outline"
              className="rounded-2xl"
            >
              Open Generated Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            Latest generation status
          </CardTitle>
          <CardDescription>
            Surface believable product feedback rather than a generic static
            mockup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedResult ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <CheckCircle2 className="h-4 w-4" /> Schedules generated
                successfully
              </div>
              <div className="mt-2 text-2xl font-semibold text-emerald-950">
                {generatedResult.planCount} plans from{" "}
                {generatedResult.constraintGroupCount} constraint groups
              </div>
              <div className="mt-2 text-sm text-emerald-800">
                Based on {generatedResult.constraintSlotCount} selected slots and{" "}
                {generatedResult.modifierCount} secondary modifiers.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No schedules have been generated in this session yet. Start in
              Schedule Builder and define your constraint state first.
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            The interface intentionally treats constraints as durable product
            memory, while ranking, compare, and backup strategy are derived
            views on top.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsView({ constraintStats }: { constraintStats: ConstraintStats }) {
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

function BuilderView({
  tool,
  setTool,
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
  tool: BuilderTool;
  setTool: (value: BuilderTool) => void;
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
  const [dragStart, setDragStart] = useState<GridCell | null>(null);
  const [dragCurrent, setDragCurrent] = useState<GridCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  const previewCells = useMemo(() => {
    if (!dragStart || !dragCurrent) return [];
    return getRangeCells(dragStart, dragCurrent);
  }, [dragStart, dragCurrent]);

  const previewKeys = useMemo(
    () => new Set(previewCells.map((cell) => `${cell.day}-${cell.time}`)),
    [previewCells],
  );
  const previewInfo =
    dragStart && dragCurrent ? describeRange(dragStart, dragCurrent) : null;

  useEffect(() => {
    if (!dragStart || !dragCurrent) return;

    const handleMouseUp = () => {
      const cells = getRangeCells(dragStart, dragCurrent);
      setConstraints((prev) => {
        const next = { ...prev };
        cells.forEach((cell) => {
          const key = `${cell.day}-${cell.time}`;
          if (tool === "erase") delete next[key];
          else next[key] = tool;
        });
        return next;
      });
      setDragStart(null);
      setDragCurrent(null);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [dragStart, dragCurrent, setConstraints, tool]);

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
                            onMouseDown={() => {
                              setDragStart({ day, time });
                              setDragCurrent({ day, time });
                            }}
                            onMouseEnter={() => {
                              if (dragStart) setDragCurrent({ day, time });
                              else setHoveredCell({ day, time });
                            }}
                            onMouseLeave={() => {
                              if (!dragStart) setHoveredCell(null);
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

function PlansView({
  activePlanId,
  setActivePlanId,
  comparedPlanIds,
  setComparedPlanIds,
  generatedResult,
  showGeneratedBanner,
  onDismissGeneratedBanner,
}: {
  activePlanId: PlanId;
  setActivePlanId: (value: PlanId) => void;
  comparedPlanIds: PlanId[];
  setComparedPlanIds: React.Dispatch<React.SetStateAction<PlanId[]>>;
  generatedResult: GeneratedResult | null;
  showGeneratedBanner: boolean;
  onDismissGeneratedBanner: () => void;
}) {
  const activePlan =
    generatedPlans.find((plan) => plan.id === activePlanId) ||
    generatedPlans[0];
  const comparedPlans = generatedPlans.filter((plan) =>
    comparedPlanIds.includes(plan.id),
  );
  const compareColumns = [comparedPlans[0], comparedPlans[1], comparedPlans[2]];
  const [compareHint, setCompareHint] = useState<string | null>(null);

  const toggleCompare = (id: PlanId) => {
    setComparedPlanIds((prev) => {
      if (prev.includes(id)) {
        setCompareHint(null);
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        setCompareHint("You can compare up to 3 plans at once.");
        return prev;
      }
      setCompareHint(null);
      return [...prev, id];
    });
  };

  const compareLimitReached = comparedPlanIds.length >= 3;

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-4">
        {showGeneratedBanner && generatedResult && (
          <Card className="rounded-3xl border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                  <CheckCircle2 className="h-4 w-4" /> Generation complete
                </div>
                <div className="mt-2 text-xl font-semibold text-emerald-950">
                  {generatedResult.planCount} plans generated from{" "}
                  {generatedResult.constraintGroupCount} constraint groups
                </div>
                <div className="mt-1 text-sm text-emerald-800">
                  Review tradeoffs derived from{" "}
                  {generatedResult.constraintSlotCount} selected slots before
                  locking a primary and backup.
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-xl border-emerald-200 bg-white text-emerald-900 hover:bg-white"
                onClick={onDismissGeneratedBanner}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

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

            {generatedPlans.map((plan) => (
              <PlanListCard
                key={plan.id}
                plan={plan}
                active={activePlanId === plan.id}
                compared={comparedPlanIds.includes(plan.id)}
                onOpen={() => setActivePlanId(plan.id)}
                onToggleCompare={() => toggleCompare(plan.id)}
                compareLimitReached={compareLimitReached}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900">
              Saved plan strategy
            </CardTitle>
            <CardDescription>
              Support the primary + backup decision model instead of a single
              winner.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="font-medium text-emerald-900">
                Plan A → Primary registration target
              </div>
              <div className="mt-1 text-emerald-800">
                Best fit for constraints and still resilient if one section
                shifts.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-medium text-slate-900">
                Plan B → Lower-intensity backup
              </div>
              <div className="mt-1">
                Safer if you want softer daily effort without rebuilding
                constraints.
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="font-medium text-amber-900">
                Plan C → Emergency fallback
              </div>
              <div className="mt-1 text-amber-800">
                Use only if preferred sections fill; timing alignment drops
                noticeably.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
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
                {comparedPlans.length === 0 ? (
                  <Card className="rounded-2xl border-slate-200 bg-slate-50 shadow-none">
                    <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <ArrowRightLeft className="h-5 w-5 text-slate-700" />
                      </div>
                      <div className="mt-4 text-lg font-semibold text-slate-900">
                        No plans selected for compare
                      </div>
                      <div className="mt-2 max-w-md text-sm text-slate-500">
                        Use the ranked plan list to add up to three plans.
                        Compare stays inside Generated Plans because reviewing
                        and deciding belong to the same workspace.
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                      Comparing {comparedPlans.length} plan
                      {comparedPlans.length > 1 ? "s" : ""}. The active plan can
                      be different from the compare set, so users can open one
                      plan in detail while benchmarking several candidates side
                      by side.
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
                        <CardTitle className="text-lg">
                          Match score breakdown
                        </CardTitle>
                        <CardDescription>
                          Direct comparison for decision-making, not just raw
                          timetable viewing.
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
                          values={compareColumns.map((plan) =>
                            plan ? `${plan.score}` : "",
                          )}
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
                          values={compareColumns.map((plan) =>
                            plan ? plan.backup : "",
                          )}
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
                )}
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
      </div>
    </div>
  );
}

function RightRail({
  activeNav,
  summaryItems,
  constraintStats,
  activePlanId,
  comparedPlanIds,
  onGenerate,
  generating,
  generationProgress,
  generationStatusText,
}: {
  activeNav: NavId;
  summaryItems: SummaryChipItem[];
  constraintStats: ConstraintStats;
  activePlanId: PlanId;
  comparedPlanIds: PlanId[];
  onGenerate: () => void;
  generating: boolean;
  generationProgress: number;
  generationStatusText: string;
}) {
  const activePlan =
    generatedPlans.find((plan) => plan.id === activePlanId) ||
    generatedPlans[0];
  const comparedPlans = generatedPlans.filter((plan) =>
    comparedPlanIds.includes(plan.id),
  );
  if (activeNav === "builder") {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">
            Constraint summary
          </CardTitle>
          <CardDescription>
            Sticky overview of the app's core state while you build and
            generate ranked schedules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">
              Single source of truth
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">
              {constraintStats.totalSlotCount} slots
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {constraintStats.totalGroupCount} grouped constraints flow into
              generation, ranking, and review.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-900">Prefer</div>
              <div className="mt-2 text-xl font-semibold text-blue-950">
                {constraintStats.preferSlotCount}
              </div>
              <div className="mt-1 text-xs text-blue-800">
                {constraintStats.preferGroupCount} grouped rules
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <div className="text-sm font-medium text-rose-900">Avoid</div>
              <div className="mt-2 text-xl font-semibold text-rose-950">
                {constraintStats.avoidSlotCount}
              </div>
              <div className="mt-1 text-xs text-rose-800">
                {constraintStats.avoidGroupCount} grouped rules
              </div>
            </div>
          </div>

          {generating && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
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
              <div className="mt-3 flex items-center justify-between text-sm text-blue-900">
                <span>Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="mt-2 h-2" />
            </div>
          )}

          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {summaryItems.map((item) => (
              <SummaryChip key={item.id} item={item} />
            ))}
          </div>

          <Separator />

          <Button
            className="h-12 w-full rounded-2xl bg-blue-600 text-base font-semibold hover:bg-blue-500"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? "Generating schedules..." : "Generate schedules"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (activeNav === "plans") {
    return (
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">
            Decision summary
          </CardTitle>
          <CardDescription>
            Sticky selection rail for primary and backup planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
              <CheckCircle2 className="h-4 w-4" /> Primary recommendation
            </div>
            <div className="mt-2 text-xl font-semibold text-emerald-950">
              {activePlan.name}
            </div>
            <div className="mt-1 text-sm text-emerald-800">
              {activePlan.summary}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <ArrowRightLeft className="h-4 w-4" /> Compared plans
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {comparedPlans.length > 0 ? (
                comparedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-3"
                  >
                    <span>{plan.name}</span>
                    <strong className="text-slate-900">{plan.score}</strong>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
                  No plans selected for compare yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="mb-3 flex items-center gap-2 font-medium text-slate-900">
              <Users className="h-4 w-4" /> Registration strategy
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Primary</span>
                <strong>{activePlan.name}</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Backup</span>
                <strong>
                  {comparedPlans.find((plan) => plan.id !== activePlan.id)
                    ?.name || "Plan B"}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3">
                <span>Seat risk</span>
                <strong>{activePlan.seatRisk}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4" />
              <div>
                Keep at least one non-ideal but seat-safe fallback. The product
                should help students leave this screen with a real registration
                plan, not just a favorite timetable.
              </div>
            </div>
          </div>

          <Button className="h-12 w-full rounded-2xl bg-slate-950 text-base font-semibold hover:bg-slate-800">
            Save primary + backup
          </Button>
          <Button variant="outline" className="h-11 w-full rounded-2xl">
            Export compare snapshot
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Product rail</CardTitle>
        <CardDescription>
          Persistent context stays here across non-core views.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
          Constraints remain the core app state even outside Builder:{" "}
          {constraintStats.totalSlotCount} selected slots are currently active.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          Builder is for input. Generated Plans is for review, compare, and
          decision.
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          Keep the end-to-end mental model stable by deriving every review
          surface from the same constraint state.
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortalHelperRefinedFlow() {
  const [activeNav, setActiveNav] = useState<NavId>("builder");
  const [tool, setTool] = useState<BuilderTool>("prefer");
  const [constraints, setConstraints] =
    useState<ConstraintMap>(initialConstraints);
  const [activePlanId, setActivePlanId] = useState<PlanId>("A");
  const [comparedPlanIds, setComparedPlanIds] = useState<PlanId[]>(["A", "B"]);
  const [fewerStudyDays, setFewerStudyDays] = useState(true);
  const [closeGapClasses, setCloseGapClasses] = useState(true);
  const [friendMatch, setFriendMatch] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState(
    "Ready to generate from your constraint map.",
  );
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedResult | null>(null);
  const [showGeneratedBanner, setShowGeneratedBanner] = useState(false);
  const [pendingRuleCount, setPendingRuleCount] = useState(0);

  const summaryItems = useMemo(() => buildSummary(constraints), [constraints]);
  const constraintStats = useMemo(
    () => buildConstraintStats(summaryItems),
    [summaryItems],
  );

  useEffect(() => {
    if (!generating) return;

    setGenerationProgress(12);
    setGenerationStatusText(
      "Validating the constraint map before searching schedule options...",
    );

    const interval = window.setInterval(() => {
      setGenerationProgress((current) => {
        if (current < 42) return Math.min(42, current + 10);
        if (current < 74) return Math.min(74, current + 7);
        if (current < 92) return Math.min(92, current + 4);
        return current;
      });
    }, 180);

    const stepTwo = window.setTimeout(() => {
      setGenerationStatusText(
        "Searching sections against your constraints, filtering conflicts, and evaluating backup paths...",
      );
    }, 520);

    const stepThree = window.setTimeout(() => {
      setGenerationStatusText(
        "Ranking plans by fit, gap efficiency, and resilience...",
      );
    }, 980);

    const finish = window.setTimeout(() => {
      window.clearInterval(interval);
      setGenerationProgress(100);
      setGenerationStatusText("Generation complete. Opening ranked plans...");
      setGeneratedResult({
        planCount: generatedPlans.length,
        constraintSlotCount: constraintStats.totalSlotCount,
        constraintGroupCount: constraintStats.totalGroupCount,
        modifierCount: pendingRuleCount - constraintStats.totalGroupCount,
      });
      setShowGeneratedBanner(true);
      setActiveNav("plans");

      const settle = window.setTimeout(() => {
        setGenerating(false);
        setGenerationProgress(0);
        setGenerationStatusText("Ready to generate from your constraint map.");
      }, 420);

      return () => window.clearTimeout(settle);
    }, 1700);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stepTwo);
      window.clearTimeout(stepThree);
      window.clearTimeout(finish);
    };
  }, [constraintStats, generating, pendingRuleCount]);

  const handleGenerate = () => {
    if (generating) return;
    const behaviorRuleCount =
      Number(fewerStudyDays) + Number(closeGapClasses) + Number(friendMatch);
    setPendingRuleCount(summaryItems.length + behaviorRuleCount);
    setGenerating(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <Card className="rounded-3xl border-slate-200 bg-slate-950 text-white shadow-xl">
          <CardContent className="p-4">
            <div className="mb-6 flex items-center gap-3 px-2 pt-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">Portal Helper</div>
                <div className="text-sm text-slate-400">
                  Constraint-driven academic planner
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => {
                const active = activeNav === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveNav(id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wand2 className="h-4 w-4" /> Constraint-first decision flow
              </div>
              <div className="mt-2 text-2xl font-semibold">
                Constraints to Ranked Plans
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Build the core constraint state in Builder, then review,
                compare, and decide inside Generated Plans.
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {activeNav === "dashboard" && (
            <DashboardView
              generatedResult={generatedResult}
              constraintStats={constraintStats}
              onGoBuilder={() => setActiveNav("builder")}
              onGoPlans={() => setActiveNav("plans")}
            />
          )}

          {activeNav === "builder" && (
            <BuilderView
              tool={tool}
              setTool={setTool}
              constraints={constraints}
              constraintStats={constraintStats}
              setConstraints={setConstraints}
              generating={generating}
              generationProgress={generationProgress}
              generationStatusText={generationStatusText}
              fewerStudyDays={fewerStudyDays}
              setFewerStudyDays={setFewerStudyDays}
              closeGapClasses={closeGapClasses}
              setCloseGapClasses={setCloseGapClasses}
              friendMatch={friendMatch}
              setFriendMatch={setFriendMatch}
            />
          )}

          {activeNav === "plans" && (
            <PlansView
              activePlanId={activePlanId}
              setActivePlanId={setActivePlanId}
              comparedPlanIds={comparedPlanIds}
              setComparedPlanIds={setComparedPlanIds}
              generatedResult={generatedResult}
              showGeneratedBanner={showGeneratedBanner}
              onDismissGeneratedBanner={() => setShowGeneratedBanner(false)}
            />
          )}

          {activeNav === "settings" && (
            <SettingsView constraintStats={constraintStats} />
          )}
        </motion.div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <RightRail
            activeNav={activeNav}
            summaryItems={summaryItems}
            constraintStats={constraintStats}
            activePlanId={activePlanId}
            comparedPlanIds={comparedPlanIds}
            onGenerate={handleGenerate}
            generating={generating}
            generationProgress={generationProgress}
            generationStatusText={generationStatusText}
          />
        </div>
      </div>
    </div>
  );
}
