import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PatientBottomNav } from '@/components/patient/PatientBottomNav';

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/m/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'patient') redirect('/dashboard');

  return (
    <div className="flex h-screen flex-col bg-brand-bg">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <PatientBottomNav />
    </div>
  );
}
