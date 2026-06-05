import type React from "react";

// ── Navigation ──
export type NavId = "dashboard" | "builder" | "plans" | "settings";

// ── Constraint domain ──
export type ConstraintMode = "prefer" | "avoid";
export type BuilderTool = ConstraintMode | "erase";
export type ConstraintMap = Record<string, ConstraintMode>;

// ── Plan domain ──
export type PlanId = string;

// ── Grid ──
export type GridCell = {
  day: string;
  time: string;
};

// ── Summary ──
export type SummaryChipItem = {
  id: string;
  state: ConstraintMode;
  label: string;
  count: number;
};

// ── Plan schedule ──
export type PlanScheduleItem = {
  title: string;
  time: string;
  tone: string;
};

export type Plan = {
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

// ── Generation ──
export type GeneratedResult = {
  planCount: number;
  constraintSlotCount: number;
  constraintGroupCount: number;
  modifierCount: number;
};

export type ConstraintStats = {
  preferSlotCount: number;
  avoidSlotCount: number;
  preferGroupCount: number;
  avoidGroupCount: number;
  totalSlotCount: number;
  totalGroupCount: number;
};

// ── Nav item shape ──
export type NavItem = {
  id: NavId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};
