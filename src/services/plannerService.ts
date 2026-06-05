import { courses as mockCourses, initialConstraints, generatedPlans } from "../features/planner/data/mock";
import type { ConstraintMap, Plan } from "../features/planner/types";

export type Course = {
  code: string;
  name: string;
  credits: number;
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCourses(): Promise<Course[]> {
  await delay(600);
  return mockCourses;
}

export async function fetchConstraints(): Promise<ConstraintMap> {
  await delay(600);
  return initialConstraints;
}

export async function generateSchedulesAPI(constraints: ConstraintMap, courses: Course[]): Promise<Plan[]> {
  await delay(1200);
  // In a real implementation, this would send constraints and courses to the backend OLS engine.
  // We return the mock generated plans for now.
  return generatedPlans;
}
