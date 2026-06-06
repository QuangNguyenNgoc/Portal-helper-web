import { AlertTriangle, RotateCcw, Unlock, Trash2 } from "lucide-react";

interface EmptyStateProps {
  onReturn: () => void;
  onClearAvoids: () => void;
  onUnpinAll: () => void;
}

export function EmptyState({ onReturn, onClearAvoids, onUnpinAll }: EmptyStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
      </div>
      
      <h2 className="mb-2 text-2xl font-semibold text-slate-900">
        Impossible Constraints
      </h2>
      
      <p className="mb-8 max-w-md text-slate-500">
        We generated 0 plans. The current combination of locked sections and strict time constraints creates a schedule conflict that cannot be resolved.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onReturn}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-medium text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="h-5 w-5" /> Return to Builder
        </button>

        <button
          onClick={onClearAvoids}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-50 px-6 py-4 font-medium text-amber-700 transition-colors hover:bg-amber-100"
        >
          <Trash2 className="h-5 w-5" /> Clear 'Avoid' times
        </button>

        <button
          onClick={onUnpinAll}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-6 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          <Unlock className="h-5 w-5" /> Unpin all sections
        </button>
      </div>
    </div>
  );
}
