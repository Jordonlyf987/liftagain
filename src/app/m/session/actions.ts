// src/app/m/session/actions.ts
// Server actions for the patient session recording flow
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ── Step 1: Create session record + get signed upload URL ──────
export async function createSessionAndGetUploadUrl(patientId: string, planId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Get clinic_id from patient
  const { data: patient } = await supabase
    .from('patients')
    .select('clinic_id')
    .eq('id', patientId)
    .single();
  if (!patient) throw new Error('Patient not found');

  // Create session row
  const scheduledFor = new Date().toISOString().split('T')[0];
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      patient_id: patientId,
      plan_id: planId,
      clinic_id: patient.clinic_id,
      scheduled_for: scheduledFor,
      status: 'uploaded',
    })
    .select()
    .single();

  if (sessionError || !session) throw new Error('Failed to create session');

  // Generate signed upload URL
  const videoPath = `${patientId}/${session.id}.mp4`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('session-videos')
    .createSignedUploadUrl(videoPath);

  if (uploadError || !uploadData) throw new Error('Failed to get upload URL');

  // Update session with video_path
  await supabase
    .from('sessions')
    .update({ video_path: videoPath })
    .eq('id', session.id);

  return {
    sessionId: session.id,
    signedUploadUrl: uploadData.signedUrl,
    videoPath,
  };
}

// ── Step 2: Mark upload complete + create processing job ────────
export async function markUploadComplete(sessionId: string) {
  const supabase = createClient();

  await supabase
    .from('sessions')
    .update({ status: 'processing' })
    .eq('id', sessionId);

  // Create processing job (triggers AI pipeline stub)
  const { error } = await supabase
    .from('processing_jobs')
    .insert({ session_id: sessionId, status: 'queued' });

  if (error) throw error;

  // Log analytics event
  await supabase.from('analytics_events').insert({
    session_id: sessionId,
    event_name: 'session.uploaded',
    properties: { timestamp: new Date().toISOString() },
  });

  revalidatePath('/m/today');
  return { success: true };
}

// ── Step 3: Submit check-in ────────────────────────────────────
export async function submitCheckin({
  sessionId,
  patientId,
  clinicId,
  painScore,
  painAreas,
  notes,
}: {
  sessionId: string;
  patientId: string;
  clinicId: string;
  painScore: number;
  painAreas?: string[];
  notes?: string;
}) {
  const supabase = createClient();

  const { error } = await supabase.from('checkins').insert({
    session_id: sessionId,
    patient_id: patientId,
    clinic_id: clinicId,
    pain_score: painScore,
    pain_areas: painAreas ?? [],
    notes: notes ?? null,
  });

  if (error) throw error;

  // Pain spike alert is auto-fired by DB trigger (fn_check_pain_spike)
  // No manual handling needed here

  revalidatePath('/m/today');
  return { success: true, painScore };
}

// ── Step 4: Poll processing status ────────────────────────────
export async function getProcessingStatus(sessionId: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('processing_jobs')
    .select('status, completed_at')
    .eq('session_id', sessionId)
    .single();

  if (data?.status === 'completed') {
    const { data: metrics } = await supabase
      .from('session_metrics')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    return { status: 'completed', metrics };
  }

  return { status: data?.status ?? 'queued', metrics: null };
}

// ── AI Pipeline Stub (simulates edge function / cron job) ──────
// In production this would be a Supabase Edge Function triggered by the DB insert
export async function simulateAIProcessing(sessionId: string) {
  const supabase = createClient();

  // Mark job as processing
  await supabase
    .from('processing_jobs')
    .update({ status: 'processing', started_at: new Date().toISOString(), attempt_count: 1 })
    .eq('session_id', sessionId);

  // Get session details for metrics generation
  const { data: session } = await supabase
    .from('sessions')
    .select('patient_id, clinic_id')
    .eq('id', sessionId)
    .single();

  if (!session) return;

  // Simulate processing delay — in production this is real CV work
  await new Promise(r => setTimeout(r, 3000));

  // Generate stub metrics
  const formScore = 0.65 + Math.random() * 0.3;
  const lowConfidence = formScore < 0.7;

  await supabase.from('session_metrics').insert({
    session_id: sessionId,
    patient_id: session.patient_id,
    clinic_id: session.clinic_id,
    rep_count: Math.floor(Math.random() * 10 + 35),
    prescribed_reps: 45,
    form_score: Number(formScore.toFixed(2)),
    avg_rom_degrees: 65 + Math.random() * 25,
    low_confidence: lowConfidence,
  });

  // Generate stub form events
  if (formScore < 0.8) {
    await supabase.from('session_events').insert([
      { session_id: sessionId, patient_id: session.patient_id, timestamp_s: 14.2, label: 'incomplete_rom', confidence: 0.87, severity: 'medium' },
      { session_id: sessionId, patient_id: session.patient_id, timestamp_s: 42.0, label: 'form_breakdown', confidence: 0.92, severity: 'high' },
    ]);
  }

  // Complete the job
  await supabase.from('processing_jobs').update({
    status: 'completed', completed_at: new Date().toISOString(),
  }).eq('session_id', sessionId);

  // Mark session completed
  await supabase.from('sessions').update({ status: 'completed' }).eq('id', sessionId);

  // Fire form_fail alert if score is below threshold
  if (formScore < 0.65) {
    const { data: patient } = await supabase
      .from('patients')
      .select('clinic_id, therapist_id')
      .eq('id', session.patient_id)
      .single();

    if (patient) {
      await supabase.from('alerts').insert({
        clinic_id: patient.clinic_id,
        patient_id: session.patient_id,
        session_id: sessionId,
        therapist_id: patient.therapist_id,
        type: 'form_fail',
        severity: formScore < 0.55 ? 'high' : 'medium',
        status: 'new',
        reason: `AI form score ${(formScore * 100).toFixed(0)}% — below clinic threshold.`,
        recommended_action: 'Review flagged timestamps and send correction cues.',
      });
    }
  }
}
