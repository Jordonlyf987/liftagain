import { createClient } from '@/lib/supabase/server';
import { PatientTable } from '@/components/clinical/PatientTable';
export const metadata = { title: 'Patients' };
export const dynamic = 'force-dynamic';
export default async function PatientsPage() {
  const supabase = createClient();
  const { data: patients } = await supabase
    .from('patient_adherence_summary')
    .select('*')
    .order('full_name');
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Patients</h1>
      </header>
      <div className="p-6"><PatientTable patients={patients ?? []} /></div>
    </div>
  );
}
