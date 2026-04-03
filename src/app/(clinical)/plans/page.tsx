import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Plans' };
export const dynamic = 'force-dynamic';
export default async function PlansPage() {
  const supabase = createClient();
  const { data: plans } = await supabase
    .from('plans')
    .select('id, name, status, sessions_per_week, patients(full_name)')
    .order('created_at', { ascending: false });
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Rehab Plans</h1>
      </header>
      <div className="p-6 space-y-2">
        {(plans ?? []).map(p => (
          <div key={p.id} className="rounded-xl border border-brand-border bg-white p-4 shadow-card flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-brand-text">{p.name}</p>
              <p className="text-xs text-brand-textLight">{(p.patients as any)?.full_name} · {p.sessions_per_week}x/week</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === 'active' ? 'bg-brand-tealSoft text-brand-teal' : 'bg-brand-bg text-brand-textLight'}`}>{p.status}</span>
          </div>
        ))}
        {!plans?.length && <p className="text-sm text-brand-textLight">No plans yet.</p>}
      </div>
    </div>
  );
}
