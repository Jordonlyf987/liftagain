import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Progress' };
export const dynamic = 'force-dynamic';
export default async function ProgressPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/m/login');
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, metrics:session_metrics(form_score, rep_count, avg_rom_degrees)')
    .eq('patient_id', patient?.id ?? '')
    .eq('status', 'completed')
    .order('scheduled_for', { ascending: false })
    .limit(10);
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-sidebar px-5 pt-10 pb-6">
        <h1 className="font-serif text-xl font-bold text-white">My Progress</h1>
      </div>
      <div className="p-4 space-y-3">
        {(sessions ?? []).length === 0 && <p className="text-center text-sm text-brand-textLight py-8">Complete sessions to see your progress.</p>}
        {(sessions ?? []).map((s: any) => {
          const m = s.metrics;
          return (
            <div key={s.id} className="rounded-2xl border border-brand-border bg-white p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-brand-text">{s.scheduled_for}</p>
                <span className="rounded-full bg-brand-tealSoft px-2 py-0.5 text-[10px] font-semibold text-brand-teal">Completed</span>
              </div>
              {m && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Form', val: m.form_score != null ? `${Math.round(m.form_score*100)}%` : '—' },
                    { label: 'Reps', val: m.rep_count ?? '—' },
                    { label: 'ROM', val: m.avg_rom_degrees != null ? `${m.avg_rom_degrees}°` : '—' },
                  ].map(x => (
                    <div key={x.label} className="rounded-lg bg-brand-bg p-2 text-center">
                      <p className="text-base font-bold text-brand-text">{x.val}</p>
                      <p className="text-[10px] text-brand-textLight">{x.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
