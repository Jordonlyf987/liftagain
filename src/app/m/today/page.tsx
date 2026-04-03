import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
export const metadata = { title: 'Today' };
export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/m/login');

  const { data: patient } = await supabase
    .from('patients')
    .select('id, full_name, clinic_id')
    .eq('user_id', user.id)
    .single();

  const { data: plan } = await supabase
    .from('plans')
    .select('id, name, sessions_per_week, exercises:plan_exercises(*, exercise:exercises(name, category, description))')
    .eq('patient_id', patient?.id ?? '')
    .eq('status', 'active')
    .maybeSingle();

  const { data: recentJobs } = await supabase
    .from('processing_jobs')
    .select('status, session_id, queued_at')
    .order('queued_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-sidebar px-5 pt-10 pb-6">
        <p className="text-xs text-brand-textLight">Welcome back,</p>
        <h1 className="font-serif text-xl font-bold text-white">{patient?.full_name?.split(' ')[0] ?? 'there'} 👋</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Active plan card */}
        {plan ? (
          <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-textLight">Active Plan</p>
                <h2 className="font-serif text-base font-bold text-brand-text">{plan.name}</h2>
                <p className="text-xs text-brand-textLight">{plan.sessions_per_week}x per week</p>
              </div>
              <Link href="/m/session"
                className="rounded-xl bg-brand-coral px-4 py-2 text-sm font-bold text-white hover:bg-brand-coral/90">
                Start Session
              </Link>
            </div>
            <div className="space-y-2">
              {(plan.exercises as any[] ?? []).map((ex: any, i: number) => (
                <div key={ex.id} className="flex items-center gap-3 rounded-lg border border-brand-border px-3 py-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-coralSoft text-xs font-bold text-brand-coral">{i+1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-text">{ex.exercise?.name}</p>
                    <p className="text-xs text-brand-textLight">{ex.sets} sets × {ex.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-card">
            <p className="text-3xl mb-2">🏋</p>
            <p className="text-sm text-brand-textLight">No active plan yet. Your therapist will assign one.</p>
          </div>
        )}

        {/* Processing status */}
        {recentJobs && recentJobs.some(j => j.status === 'processing' || j.status === 'queued') && (
          <div className="rounded-2xl border border-brand-yellowSoft bg-brand-yellowSoft p-4">
            <p className="text-sm font-semibold text-yellow-700">⚙️ Processing your session…</p>
            <p className="text-xs text-yellow-600 mt-0.5">Results will appear shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
