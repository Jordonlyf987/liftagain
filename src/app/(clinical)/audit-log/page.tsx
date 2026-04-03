import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Audit Log' };
export const dynamic = 'force-dynamic';
export default async function AuditLogPage() {
  const supabase = createClient();
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('id, action, entity_type, created_at, actor:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Audit Log</h1>
      </header>
      <div className="p-6">
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-card">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-brand-border bg-brand-bg text-xs text-brand-textLight">
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">By</th>
              <th className="px-4 py-2 text-left">Entity</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr></thead>
            <tbody>
              {(logs ?? []).map((l, i) => (
                <tr key={l.id} className={`border-b border-brand-border last:border-0 ${i%2===1?'bg-brand-bg/40':''}`}>
                  <td className="px-4 py-2 font-mono text-xs text-brand-coral">{l.action}</td>
                  <td className="px-4 py-2 text-xs">{(l.actor as any)?.full_name ?? '—'}</td>
                  <td className="px-4 py-2 text-xs text-brand-textLight">{l.entity_type ?? '—'}</td>
                  <td className="px-4 py-2 text-xs text-brand-textLight">{new Date(l.created_at).toLocaleString('en-SG')}</td>
                </tr>
              ))}
              {!logs?.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-textLight text-xs">No audit events yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
