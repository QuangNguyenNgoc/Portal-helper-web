import { courses as mockCourses, initialConstraints, generatedPlans } from "../features/planner/data/mock";
import type { ConstraintMap, Plan } from "../features/planner/types";

export type CourseSection = {
  id: string;
  instructor: string;
  schedule: string;
};

export type Course = {
  code: string;
  name: string;
  credits: number;
  sections?: CourseSection[];
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCourses(): Promise<Course[]> {
  await delay(600);
  return mockCourses.map((c, i) => ({
    ...c,
    sections: [
      { id: `${c.code}-01`, instructor: "Dr. Smith", schedule: "Mon/Wed 10:00 AM" },
      { id: `${c.code}-02`, instructor: "Prof. Johnson", schedule: "Tue/Thu 2:00 PM" },
      { id: `${c.code}-03`, instructor: "Dr. Williams", schedule: "Fri 9:00 AM" },
    ]
  }));
}

export async function fetchConstraints(): Promise<ConstraintMap> {
  await delay(600);
  return initialConstraints;
}

export async function generateSchedulesAPI(
  constraints: ConstraintMap, 
  courses: Course[], 
  pinnedSectionIds: string[]
): Promise<Plan[]> {
  await delay(1200);
  
  // Simulated filtering of combinations based on pinned sections
  courses.forEach(course => {
    if (course.sections) {
      const pinnedForCourse = course.sections.find(s => pinnedSectionIds.includes(s.id));
      if (pinnedForCourse) {
        console.log(`[Algorithm] Locking ${course.code} to section ${pinnedForCourse.id}`);
        // In real logic, course.sections = [pinnedForCourse]
      }
    }
  });

  // In a real implementation, this would send constraints and courses to the backend OLS engine.
  // We return the mock generated plans for now.
  return generatedPlans;
}

const universityCourseDatabase: Course[] = [
  ...mockCourses,
  { code: "CS222", name: "Computer Architecture", credits: 3 },
  { code: "CS301", name: "Operating Systems", credits: 4 },
  { code: "MATH310", name: "Linear Algebra", credits: 3 },
  { code: "PHY202", name: "Electromagnetism", credits: 4 },
  { code: "ENG101", name: "English Composition", credits: 2 },
  { code: "HIST105", name: "World History", credits: 3 },
].map(c => ({
  ...c,
  sections: [
    { id: `${c.code}-01`, instructor: "Dr. Smith", schedule: "Mon/Wed 10:00 AM" },
    { id: `${c.code}-02`, instructor: "Prof. Johnson", schedule: "Tue/Thu 2:00 PM" },
  ]
}));

export async function searchUniversityCourses(query: string): Promise<Course[]> {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return universityCourseDatabase.filter(c => 
    c.code.toLowerCase().includes(lowerQuery) || 
    c.name.toLowerCase().includes(lowerQuery)
  );
}
