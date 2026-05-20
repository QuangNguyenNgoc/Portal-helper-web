import {
  CalendarRange,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { generateHalfHourSlots } from "../lib/time";
import type { ConstraintMap, NavItem, Plan } from "../types";

// ── Navigation ──

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "builder", label: "Schedule Builder", icon: CalendarRange },
  { id: "plans", label: "Generated Plans", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

// ── Time grid ──

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const timeSlots = ['1', '2', '2.5', '4', '5', '6', '7', '8', '8.5', '9', '10'];

// ── Courses ──

export const courses = [
  { code: "CS221", name: "Data Structures", credits: 3 },
  { code: "MATH204", name: "Discrete Mathematics", credits: 3 },
  { code: "PHY102", name: "General Physics", credits: 4 },
  { code: "BUS110", name: "Academic Writing", credits: 2 },
];

// ── Quick presets ──

export const quickPresets = [
  { id: "morning", label: "Avoid mornings" },
  { id: "afternoon", label: "Avoid afternoons" },
  { id: "days", label: "Fewer study days" },
  { id: "gaps", label: "Close-gap classes" },
];

// ── Initial constraints ──

export const initialConstraints: ConstraintMap = {
  "Mon-1": "avoid",
  "Mon-2": "avoid",
  "Tue-4": "prefer",
  "Tue-5": "prefer",
  "Thu-6": "prefer",
  "Thu-7": "prefer",
  "Fri-9": "avoid",
  "Fri-10": "avoid",
};

// ── Generated plans (mock data) ──

export const generatedPlans: Plan[] = [
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
        { title: "MATH204", time: "13:00–15:00", tone: "bg-blue-100 text-blue-900" },
        { title: "PHY102 Lab", time: "16:00–17:30", tone: "bg-amber-100 text-amber-900" },
      ],
      Tue: [
        { title: "CS221", time: "09:30–11:00", tone: "bg-emerald-100 text-emerald-900" },
      ],
      Wed: [
        { title: "MATH204", time: "13:00–15:00", tone: "bg-blue-100 text-blue-900" },
      ],
      Thu: [
        { title: "CS221", time: "09:30–11:00", tone: "bg-emerald-100 text-emerald-900" },
      ],
      Fri: [
        { title: "BUS110", time: "10:00–12:00", tone: "bg-violet-100 text-violet-900" },
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
        { title: "MATH204", time: "10:00–12:00", tone: "bg-blue-100 text-blue-900" },
      ],
      Tue: [
        { title: "CS221", time: "11:00–12:30", tone: "bg-emerald-100 text-emerald-900" },
        { title: "BUS110", time: "15:00–17:00", tone: "bg-violet-100 text-violet-900" },
      ],
      Wed: [
        { title: "MATH204", time: "10:00–12:00", tone: "bg-blue-100 text-blue-900" },
      ],
      Thu: [
        { title: "CS221", time: "11:00–12:30", tone: "bg-emerald-100 text-emerald-900" },
      ],
      Fri: [
        { title: "PHY102 Lab", time: "14:00–15:30", tone: "bg-amber-100 text-amber-900" },
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
        { title: "CS221", time: "08:00–09:30", tone: "bg-emerald-100 text-emerald-900" },
      ],
      Tue: [
        { title: "MATH204", time: "13:00–15:00", tone: "bg-blue-100 text-blue-900" },
      ],
      Wed: [
        { title: "CS221", time: "08:00–09:30", tone: "bg-emerald-100 text-emerald-900" },
      ],
      Thu: [
        { title: "BUS110", time: "09:00–11:00", tone: "bg-violet-100 text-violet-900" },
        { title: "MATH204", time: "13:00–15:00", tone: "bg-blue-100 text-blue-900" },
      ],
      Fri: [
        { title: "PHY102 Lab", time: "16:00–17:30", tone: "bg-amber-100 text-amber-900" },
      ],
    },
  },
];
