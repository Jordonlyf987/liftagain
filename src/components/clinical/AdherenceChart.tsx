'use client';
export function AdherenceChart() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const values = [72, 85, 68, 91, 60, 45, 78];
  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
      <h2 className="mb-4 font-serif text-sm font-bold text-brand-text">7-Day Adherence</h2>
      <div className="flex items-end gap-2 h-24">
        {days.map((d, i) => (
          <div key={d} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t-sm bg-brand-coral/20 transition-all hover:bg-brand-coral/40"
              style={{ height: `${values[i]}%` }} />
            <span className="text-[10px] text-brand-textLight">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
