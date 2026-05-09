import { Badge } from "@/components/ui/badge";

export function CourseCard({
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
