import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { LabToggle } from "../../../components/planner/LabToggle";
import type { BuilderTool } from "../types";

interface GridToolbarProps {
  tool: BuilderTool;
  setTool: (tool: BuilderTool) => void;
  showLabPeriods: boolean;
  toggleShowLabPeriods: () => void;
}

export function GridToolbar({ tool, setTool, showLabPeriods, toggleShowLabPeriods }: GridToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2 mb-4 border-b border-slate-200/60 pb-4">
      <Tabs
        value={tool}
        onValueChange={(value) => setTool(value as BuilderTool)}
        className="w-auto"
      >
        <TabsList className="rounded-full bg-slate-200/50 p-1">
          <TabsTrigger value="prefer" className="rounded-full px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Check className="mr-2 h-4 w-4 shrink-0 text-blue-600" /> Prefer
          </TabsTrigger>
          <TabsTrigger value="avoid" className="rounded-full px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <X className="mr-2 h-4 w-4 shrink-0 text-rose-600" /> Avoid
          </TabsTrigger>
          <TabsTrigger value="erase" className="rounded-full px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Erase
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-4">
         <LabToggle
           showLabPeriods={showLabPeriods}
           onToggle={toggleShowLabPeriods}
         />
      </div>
    </div>
  );
}
