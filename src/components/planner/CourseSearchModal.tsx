import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { searchUniversityCourses, type Course } from "../../services/plannerService";
import { usePlannerStore } from "../../features/planner/store/PlannerContext";

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CourseSearchModal({ isOpen, onClose }: CourseSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { addCourse, courses } = usePlannerStore();

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const found = await searchUniversityCourses(query);
        setResults(found);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleAdd = (course: Course) => {
    addCourse(course);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl bg-white shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header / Search Input */}
              <div className="relative border-b border-slate-100 p-4">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by course code or name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 outline-none text-lg"
                />
                <button
                  onClick={onClose}
                  className="absolute right-7 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Results Area */}
              <div className="overflow-y-auto p-4 flex-1">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                    <p>Searching courses...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((course) => {
                      const isAdded = courses.some((c) => c.code === course.code);
                      return (
                        <div
                          key={course.code}
                          className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{course.code}</span>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                {course.credits} cr
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-slate-500">{course.name}</div>
                          </div>
                          <button
                            disabled={isAdded}
                            onClick={() => handleAdd(course)}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                              isAdded
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            {isAdded ? (
                              "Added"
                            ) : (
                              <>
                                <Plus className="h-4 w-4" /> Add
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : query.trim() ? (
                  <div className="py-12 text-center text-slate-500">
                    No courses found for "{query}".
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    Type a course code (e.g. CS221) or name to begin searching.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
