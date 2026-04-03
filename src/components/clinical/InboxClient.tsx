'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Alert = {
  id: string; type: string; severity: string; status: string;
  reason: string; recommended_action?: string | null; created_at: string;
  patient?: { id: string; full_name: string } | null;
  session?: { id: string; video_path?: string | null; scheduled_for?: string | null } | null;
};

interface Props { initialAlerts: Alert[]; counts: { new: number; in_review: number; resolved: number } }

const SEVERITY_STYLE: Record<string, string> = {
  high:   'bg-brand-redSoft text-brand-red border-brand-red/20',
  medium: 'bg-brand-yellowSoft text-yellow-700 border-yellow-200',
  low:    'bg-brand-tealSoft text-brand-teal border-brand-teal/20',
};
const TYPE_ICON: Record<string, string> = {
  pain_spike: '🔥', form_fail: '⚠️', non_adherence: '📅', processing_failed: '❌',
};

export function InboxClient({ initialAlerts, counts }: Props) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'new'|'in_review'|'resolved'>('new');
  const supabase = createClient();

  const filtered = alerts.filter(a => a.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('alerts').update({ status }).eq('id', id);
    if (error) { toast.error('Failed to update alert'); return; }
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === 'resolved' ? 'Alert resolved ✓' : 'Marked in review');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Alerts Inbox</h1>
        <div className="mt-2 flex gap-3">
          {(['new','in_review','resolved'] as const).map(tab => {
            const cnt = tab === 'new' ? counts.new : tab === 'in_review' ? counts.in_review : counts.resolved;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${filter === tab ? 'bg-brand-coral text-white' : 'bg-brand-bg text-brand-textMid hover:bg-brand-border'}`}>
                {tab.replace('_',' ')} {cnt > 0 && <span className="ml-1">({cnt})</span>}
              </button>
            );
          })}
        </div>
      </header>

      <div className="p-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-brand-border bg-white p-12 text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm text-brand-textLight">No {filter.replace('_',' ')} alerts</p>
          </div>
        )}
        {filtered.map(alert => (
          <div key={alert.id} className={`rounded-xl border bg-white p-4 shadow-card ${SEVERITY_STYLE[alert.severity] ?? ''}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{TYPE_ICON[alert.type] ?? '📌'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-sm font-bold text-brand-text">{alert.patient?.full_name ?? 'Patient'}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SEVERITY_STYLE[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-brand-textLight">{new Date(alert.created_at).toLocaleDateString('en-SG')}</span>
                </div>
                <p className="mt-1 text-sm text-brand-textMid">{alert.reason}</p>
                {alert.recommended_action && (
                  <p className="mt-1 text-xs text-brand-textLight italic">→ {alert.recommended_action}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/patients/${alert.patient?.id}`}
                    className="rounded-lg bg-brand-bg px-3 py-1.5 text-xs font-semibold text-brand-textMid hover:bg-brand-border">
                    View Patient
                  </a>
                  {alert.status === 'new' && (
                    <button onClick={() => updateStatus(alert.id, 'in_review')}
                      className="rounded-lg bg-brand-coralSoft px-3 py-1.5 text-xs font-semibold text-brand-coral hover:bg-brand-coralMid">
                      Mark In Review
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button onClick={() => updateStatus(alert.id, 'resolved')}
                      className="rounded-lg bg-brand-tealSoft px-3 py-1.5 text-xs font-semibold text-brand-teal hover:bg-brand-teal/20">
                      Resolve ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
