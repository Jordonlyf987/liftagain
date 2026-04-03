// src/app/(clinical)/dashboard/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { DashboardMetrics } from '@/components/clinical/DashboardMetrics';
import { AlertBanner } from '@/components/clinical/AlertBanner';
import { PatientTable } from '@/components/clinical/PatientTable';
import { AdherenceChart } from '@/components/clinical/AdherenceChart';
import { ActivityFeed } from '@/components/clinical/ActivityFeed';
import { QuickActions } from '@/components/clinical/QuickActions';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = createClient();

  // Parallel data fetching
  const [
    { data: profile },
    { count: newAlerts },
    { data: patients },
    { data: recentSessions },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, clinic_id').single(),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('patient_adherence_summary').select('*').limit(10),
    supabase.from('sessions')
      .select('id, patient_id, status, created_at, patients(full_name)')
      .in('status', ['completed', 'processing'])
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      {/* Topbar */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-border bg-white px-6 py-3">
        <div>
          <h1 className="font-serif text-lg font-bold text-brand-text">
            Good morning, {profile?.full_name?.split(' ')[0] ?? 'Doctor'} 👋
          </h1>
          <p className="mt-0.5 text-xs text-brand-textLight">
            {new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <a href="/inbox" className="flex items-center gap-2 rounded-lg bg-brand-coral px-4 py-2 text-sm font-bold text-white hover:bg-brand-coral/90">
          ⚡ View Inbox
          {(newAlerts ?? 0) > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{newAlerts}</span>
          )}
        </a>
      </header>

      <div className="p-6">
        {/* Alert banner */}
        {(newAlerts ?? 0) > 0 && (
          <AlertBanner count={newAlerts ?? 0} className="mb-5" />
        )}

        {/* Metric cards */}
        <Suspense fallback={<LoadingSkeleton rows={1} cols={4} />}>
          <DashboardMetrics
            newAlerts={newAlerts ?? 0}
            sessionsToday={recentSessions?.length ?? 0}
            activePatients={patients?.length ?? 0}
          />
        </Suspense>

        {/* Two-column layout */}
        <div className="mt-5 grid grid-cols-[1fr_300px] gap-4">
          <div className="space-y-4">
            <Suspense fallback={<LoadingSkeleton rows={5} />}>
              <PatientTable patients={patients ?? []} />
            </Suspense>
            <Suspense fallback={<LoadingSkeleton rows={1} />}>
              <AdherenceChart />
            </Suspense>
          </div>
          <div className="space-y-4">
            <QuickActions />
            <ActivityFeed sessions={recentSessions ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
