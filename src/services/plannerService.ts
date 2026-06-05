import {
  courses as mockCourses,
  initialConstraints,
  generatedPlans,
} from "../features/planner/data/mock";
import type { ConstraintMap, Plan } from "../features/planner/types";
import { generateValidPlans } from "../utils/schedulerAlgorithm";

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
    sections: generateDistinctSections(c.code, i),
  }));
}

export async function fetchConstraints(): Promise<ConstraintMap> {
  await delay(600);
  return initialConstraints;
}

export async function generateSchedulesAPI(
  constraints: ConstraintMap,
  courses: Course[],
  pinnedSectionIds: string[],
): Promise<Plan[]> {
  await delay(1200);

  // Call the core scheduling algorithm engine
  const plans = generateValidPlans(courses, constraints, pinnedSectionIds);

  console.log(`[Algorithm] Found ${plans.length} valid plan combinations.`);

  return plans;
}

// Hàm tạo giờ học ngẫu nhiên không bị trùng lặp hoàn toàn
const generateDistinctSections = (courseCode: string, index: number) => {
  // Tạo ra 3 lớp cho mỗi môn, phân tán theo index để các môn khác nhau có giờ khác nhau
  const patterns = [
    [
      {
        id: `${courseCode}-01`,
        instructor: "Dr. A",
        schedule: "Mon 1-3, Wed 1-3",
      },
      {
        id: `${courseCode}-02`,
        instructor: "Dr. B",
        schedule: "Tue 4-6, Thu 4-6",
      },
      { id: `${courseCode}-03`, instructor: "Dr. C", schedule: "Fri 7-9" },
    ],
    [
      {
        id: `${courseCode}-01`,
        instructor: "Dr. X",
        schedule: "Mon 4-6, Wed 4-6",
      },
      {
        id: `${courseCode}-02`,
        instructor: "Dr. Y",
        schedule: "Tue 7-9, Thu 7-9",
      },
      { id: `${courseCode}-03`, instructor: "Dr. Z", schedule: "Sat 1-4" },
    ],
    [
      {
        id: `${courseCode}-01`,
        instructor: "Dr. M",
        schedule: "Mon 7-9, Wed 7-9",
      },
      {
        id: `${courseCode}-02`,
        instructor: "Dr. N",
        schedule: "Tue 1-3, Thu 1-3",
      },
      { id: `${courseCode}-03`, instructor: "Dr. P", schedule: "Fri 1-3" },
    ],
  ];
  return patterns[index % 3]; // Xoay vòng 3 pattern để đảm bảo xếp được ít nhất 5-6 môn
};

const universityCourseDatabase: Course[] = [
  ...mockCourses,
  { code: "CS222", name: "Computer Architecture", credits: 3 },
  { code: "CS301", name: "Operating Systems", credits: 4 },
  { code: "MATH310", name: "Linear Algebra", credits: 3 },
  { code: "PHY202", name: "Electromagnetism", credits: 4 },
  { code: "ENG101", name: "English Composition", credits: 2 },
  { code: "HIST105", name: "World History", credits: 3 },
].map((c, index) => ({
  ...c,
  sections: generateDistinctSections(c.code, index),
}));

export async function searchUniversityCourses(
  query: string,
): Promise<Course[]> {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return universityCourseDatabase.filter(
    (c) =>
      c.code.toLowerCase().includes(lowerQuery) ||
      c.name.toLowerCase().includes(lowerQuery),
  );
}
