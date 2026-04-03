import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PatientProfileClient } from '@/components/clinical/PatientProfileClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase.from('patients').select('full_name').eq('id', params.id).single();
  return { title: data?.full_name ?? 'Patient' };
}

export const dynamic = 'force-dynamic';

export default async function PatientPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [
    { data: patient },
    { data: sessions },
    { data: plan },
    { data: messages },
    { data: checkins },
    { data: adherence },
  ] = await Promise.all([
    supabase.from('patients').select('*, therapist:therapist_profiles(id, specialisation, profile:profiles(full_name))').eq('id', params.id).single(),
    supabase.from('sessions').select('*, metrics:session_metrics(*), events:session_events(*), job:processing_jobs(status)').eq('patient_id', params.id).is('deleted_at', null).order('created_at', { ascending: false }).limit(20),
    supabase.from('plans').select('*, exercises:plan_exercises(*, exercise:exercises(name, category, demo_video_url))').eq('patient_id', params.id).eq('status', 'active').maybeSingle(),
    supabase.from('messages').select('*').eq('patient_id', params.id).order('created_at', { ascending: true }).limit(50),
    supabase.from('checkins').select('pain_score, submitted_at').eq('patient_id', params.id).order('submitted_at', { ascending: false }).limit(10),
    supabase.from('patient_adherence_summary').select('*').eq('patient_id', params.id).maybeSingle(),
  ]);

  if (!patient) notFound();

  return (
    <PatientProfileClient
      patient={patient}
      sessions={sessions ?? []}
      activePlan={plan ?? null}
      messages={messages ?? []}
      checkins={checkins ?? []}
      adherenceSummary={adherence}
    />
  );
}
