// src/app/(clinical)/layout.tsx
// Wraps all clinical routes: /dashboard, /inbox, /patients, etc.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClinicalSidebar } from '@/components/clinical/ClinicalSidebar';
import { ClinicalTopbar } from '@/components/clinical/ClinicalTopbar';

export default async function ClinicalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, clinic:clinics(name, slug)')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'patient') redirect('/m/today');

  const { data: alertCount } = await supabase
    .from('alerts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <ClinicalSidebar
        profile={profile}
        clinicName={(profile.clinic as any)?.name ?? 'Clinic'}
        newAlertCount={alertCount ?? 0}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
