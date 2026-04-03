interface Session { id: string; status: string; created_at: string; patients?: { full_name: string } | null }
interface Props { sessions: Session[] }
export function ActivityFeed({ sessions }: Props) {
  return (
    <div className="rounded-xl border border-brand-border bg-white shadow-card">
      <div className="border-b border-brand-border px-4 py-3">
        <h2 className="font-serif text-sm font-bold text-brand-text">Recent Activity</h2>
      </div>
      <div className="divide-y divide-brand-border">
        {sessions.length === 0 && <p className="p-4 text-xs text-brand-textLight">No activity yet.</p>}
        {sessions.slice(0, 8).map(s => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-base">{s.status === 'completed' ? '✅' : '⚙️'}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-brand-text">{(s.patients as any)?.full_name ?? 'Patient'}</p>
              <p className="text-[10px] text-brand-textLight">{s.status} · {new Date(s.created_at).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
