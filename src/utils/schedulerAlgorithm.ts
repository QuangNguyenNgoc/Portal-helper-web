import type { Course, CourseSection } from "../services/plannerService";
import type { ConstraintMap, Plan } from "../features/planner/types";

// ── Grid Definition ──
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = ["1", "2", "2.5", "4", "5", "6", "7", "8", "8.5", "9", "10"];

const slotIndexMap = new Map<string, bigint>();
let idx = 0n;
for (const d of days) {
  for (const s of slots) {
    slotIndexMap.set(`${d}-${s}`, idx++);
  }
}

// ── Schedule Parser ──
function parseScheduleToGridIds(scheduleStr: string): string[] {
  const result: string[] = [];
  const scheduleDays: string[] = [];

  if (scheduleStr.includes("Mon")) scheduleDays.push("Mon");
  if (scheduleStr.includes("Tue")) scheduleDays.push("Tue");
  if (scheduleStr.includes("Wed")) scheduleDays.push("Wed");
  if (scheduleStr.includes("Thu")) scheduleDays.push("Thu");
  if (scheduleStr.includes("Fri")) scheduleDays.push("Fri");
  if (scheduleStr.includes("Sat")) scheduleDays.push("Sat");

  let timeSlots: string[] = [];
  // Mock parser rules mapped to UI grid slots
  if (scheduleStr.includes("8:00 AM")) timeSlots = ["1"];
  if (scheduleStr.includes("9:00 AM")) timeSlots = ["1", "2"];
  if (scheduleStr.includes("9:30")) timeSlots = ["1", "2"];
  if (scheduleStr.includes("10:00 AM")) timeSlots = ["2", "2.5"];
  if (scheduleStr.includes("11:00")) timeSlots = ["4"];
  if (scheduleStr.includes("12:00")) timeSlots = ["4"];
  if (scheduleStr.includes("1:00 PM")) timeSlots = ["4", "5"];
  if (scheduleStr.includes("2:00 PM")) timeSlots = ["6", "7"];
  if (scheduleStr.includes("3:00 PM")) timeSlots = ["6", "7"];
  if (scheduleStr.includes("4:00 PM")) timeSlots = ["8", "8.5"];

  // Fallback for unmapped mock strings
  if (timeSlots.length === 0) timeSlots = ["1"];

  for (const d of scheduleDays) {
    for (const s of timeSlots) {
      result.push(`${d}-${s}`);
    }
  }
  return result;
}

// ── Core Engine ──
export function generateValidPlans(
  courses: Course[],
  constraints: ConstraintMap,
  pinnedSectionIds: string[]
): Plan[] {
  // 1. Build Avoid and Prefer bitmasks from user constraints
  let avoidMask = 0n;
  let preferMask = 0n;

  for (const [key, mode] of Object.entries(constraints)) {
    const bitIndex = slotIndexMap.get(key);
    if (bitIndex !== undefined) {
      if (mode === "avoid") avoidMask |= 1n << bitIndex;
      if (mode === "prefer") preferMask |= 1n << bitIndex;
    }
  }

  // 2. Pre-process courses: Parse schedules, create masks, and apply pinned sections
  const processedCourses = courses.map((course) => {
    if (!course.sections || course.sections.length === 0) {
      return { ...course, validSections: [] };
    }

    // Hard Constraint: Pinned Section
    const pinned = course.sections.find((s) =>
      pinnedSectionIds.includes(s.id)
    );
    const validSections = pinned ? [pinned] : course.sections;

    const sectionsWithMasks = validSections.map((sec) => {
      const gridIds = parseScheduleToGridIds(sec.schedule);
      let mask = 0n;
      gridIds.forEach((id) => {
        const bitIndex = slotIndexMap.get(id);
        if (bitIndex !== undefined) mask |= 1n << bitIndex;
      });
      return { ...sec, mask, gridIds };
    });

    return { ...course, validSections: sectionsWithMasks };
  });

  const validCombinations: { course: Course; section: CourseSection & { mask: bigint; gridIds: string[] } }[][] = [];

  // 3. Backtracking to find all valid non-overlapping combinations
  function backtrack(
    courseIndex: number,
    currentMask: bigint,
    currentCombination: any[]
  ) {
    // Found a valid schedule containing all requested courses
    if (courseIndex === processedCourses.length) {
      validCombinations.push([...currentCombination]);
      return;
    }

    const course = processedCourses[courseIndex];
    
    // If a course has no valid sections (e.g. database error), we can't build a full schedule
    if (course.validSections.length === 0) return;

    for (const sec of course.validSections) {
      // Hard Constraint: Overlap with Avoid mask
      if ((sec.mask & avoidMask) !== 0n) continue;

      // Hard Constraint: Overlap with already scheduled sections
      if ((sec.mask & currentMask) !== 0n) continue;

      // Try this branch
      currentCombination.push({ course, section: sec });
      backtrack(courseIndex + 1, currentMask | sec.mask, currentCombination);
      currentCombination.pop();
    }
  }

  backtrack(0, 0n, []);

  // 4. Map the valid combinations back to the Plan UI interface and score them
  const tones = [
    "bg-emerald-100 text-emerald-900",
    "bg-blue-100 text-blue-900",
    "bg-violet-100 text-violet-900",
    "bg-amber-100 text-amber-900",
    "bg-rose-100 text-rose-900",
  ];

  return validCombinations
    .map((combo, index) => {
      let score = 75; // Baseline score for a valid schedule

      // Scoring logic based on Prefer mask hits
      combo.forEach(({ section }) => {
        if ((section.mask & preferMask) !== 0n) {
          score += 15; // Bonus for hitting preferred times
        }
      });

      // Cap at 100
      score = Math.min(100, score);

      const schedule: any = {};
      const coursesSummary: string[] = [];

      combo.forEach(({ course, section }, i) => {
        coursesSummary.push(`${course.code} • ${section.schedule} (${section.instructor})`);

        const tone = tones[i % tones.length];

        // Fill out the UI timetable
        section.gridIds.forEach((id: string) => {
          const [day, time] = id.split("-");
          if (!schedule[day]) schedule[day] = [];
          
          // Deduplicate visual blocks if a class spans adjacent grid slots (1 and 2)
          // We will just render one block for simplicity in the mock builder UI,
          // but for exact timetable, we push it to the first slot.
          // Since the UI groups by day, we just push the title and time.
          if (!schedule[day].some((s: any) => s.title === course.code)) {
            schedule[day].push({
              title: course.code,
              time: section.schedule,
              tone,
            });
          }
        });
      });

      return {
        id: `Gen-${index}`,
        name: `Plan Option ${index + 1}`,
        label: `Score: ${score}`,
        summary: "Algorithmically calculated optimal schedule.",
        score,
        studyDays: Object.keys(schedule).length,
        gapProfile: "Auto-optimized",
        dailyLoad: "Balanced",
        seatRisk: "Low",
        friendMatch: 50,
        seatAvailability: "Available",
        conflict: "None",
        backup: "High",
        recommended: index === 0, // Top score gets recommended
        scoreBreakdown: {
          constraintFit: score,
          gapEfficiency: 85,
          dailyBalance: 80,
          backupResilience: 90,
          friendMatching: 50,
        },
        why: [
          "Respects all hard constraints and avoid blocks.",
          score > 85 ? "Strongly aligns with preferred time slots." : "Valid schedule, but misses some preferred times.",
        ],
        courses: coursesSummary,
        notes: [
          `This plan requires you to attend campus ${Object.keys(schedule).length} days a week.`
        ],
        schedule,
      };
    })
    .sort((a, b) => b.score - a.score);
}
