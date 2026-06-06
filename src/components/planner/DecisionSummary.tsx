import { useState } from "react";
import { CheckCircle2, Copy, FileText, Check } from "lucide-react";
import { usePlannerStore } from "../../features/planner/store/PlannerContext";

export function DecisionSummary() {
  const { generatedPlansList, selectedPrimaryPlanId, selectedBackupPlanId } = usePlannerStore();
  const [copied, setCopied] = useState(false);

  // Find the actual plan objects
  const primaryPlan = generatedPlansList.find(p => p.id === selectedPrimaryPlanId);
  const backupPlan = generatedPlansList.find(p => p.id === selectedBackupPlanId);

  const handleExport = () => {
    if (!primaryPlan) return;
    
    let exportText = "🎓 Registration List:\n\n";
    exportText += `[PRIMARY PLAN: ${primaryPlan.name}]\n`;
    exportText += `Score: ${primaryPlan.score}/100\n`;
    
    primaryPlan.courses.forEach(c => {
      exportText += `- ${c}\n`;
    });

    if (backupPlan) {
      exportText += `\n[BACKUP PLAN: ${backupPlan.name}]\n`;
      backupPlan.courses.forEach(c => {
        exportText += `- ${c}\n`;
      });
    }

    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-slate-900">Registration Ready</h3>
      </div>
      
      <div className="mb-6 space-y-4">
        {primaryPlan ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-800">
              Primary Plan
            </div>
            <div className="font-medium text-slate-900">
              {primaryPlan.name} <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{primaryPlan.score} pts</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
            Click a Plan Card to select it as your Primary Plan.
          </div>
        )}

        {backupPlan && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Backup Plan
            </div>
            <div className="font-medium text-slate-900">
              {backupPlan.name} <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">{backupPlan.score} pts</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleExport}
        disabled={!primaryPlan}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition-all ${
          !primaryPlan
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : copied 
              ? "bg-emerald-100 text-emerald-800" 
              : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copied to Clipboard!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Export Registration Codes
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        Copy these codes to paste directly into your university portal.
      </p>
    </div>
  );
}
