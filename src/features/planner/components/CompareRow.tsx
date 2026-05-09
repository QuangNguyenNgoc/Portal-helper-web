export function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid grid-cols-[180px_repeat(3,minmax(180px,1fr))] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <div className="font-medium text-slate-700">{label}</div>
      {values.map((value, index) => (
        <div
          key={index}
          className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600"
        >
          {value || "—"}
        </div>
      ))}
    </div>
  );
}
