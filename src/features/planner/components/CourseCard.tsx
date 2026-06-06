import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, LockOpen, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { usePlannerStore } from "../store/PlannerContext";
import type { CourseSection } from "../../../services/plannerService";

function SectionPinToggle({ 
  section, 
  courseCode, 
  isPinned, 
  onToggle 
}: { 
  section: CourseSection; 
  courseCode: string; 
  isPinned: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-center justify-between rounded-xl border p-2 transition-colors ${
      isPinned ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200"
    }`}>
      <div>
        <div className={`text-xs font-semibold ${isPinned ? "text-blue-900" : "text-slate-700"}`}>
          Section {section.id.split('-')[1] || section.id}
        </div>
        <div className={`text-[10px] ${isPinned ? "text-blue-700" : "text-slate-500"}`}>
          {section.instructor} • {section.schedule}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          isPinned ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        }`}
        title={isPinned ? "Unlock section" : "Lock section"}
      >
        {isPinned ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
      </button>
    </div>
  );
}

export function CourseCard({
  code,
  name,
  credits,
  sections,
}: {
  code: string;
  name: string;
  credits: number;
  sections?: CourseSection[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pinnedSectionIds, togglePinSection, removeCourse } = usePlannerStore();

  const hasPinnedSection = sections?.some(s => pinnedSectionIds.includes(s.id));

  return (
    <div className={`rounded-2xl border bg-white p-3 shadow-sm transition-colors ${
      hasPinnedSection ? "border-blue-200 shadow-blue-100/50" : "border-slate-200 shadow-slate-100/70"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">{code}</span>
            {hasPinnedSection && (
              <Lock className="h-3 w-3 text-blue-600" />
            )}
          </div>
          <div className="mt-1 text-sm text-slate-500">{name}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full">
            {credits} cr
          </Badge>
          <button
            onClick={() => removeCourse(code)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title={`Remove ${code}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {sections && sections.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span>{isExpanded ? "Hide sections" : "View sections"}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {sections.map(section => (
                <SectionPinToggle
                  key={section.id}
                  section={section}
                  courseCode={code}
                  isPinned={pinnedSectionIds.includes(section.id)}
                  onToggle={() => togglePinSection(section.id, code)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
