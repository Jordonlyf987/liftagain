'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createSessionAndGetUploadUrl, markUploadComplete, submitCheckin } from './actions';
import { toast } from 'sonner';

export default function SessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload'|'checkin'|'done'>('upload');
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState<string|null>(null);
  const [patientId, setPatientId] = useState<string|null>(null);
  const [clinicId, setClinicId] = useState<string|null>(null);
  const [pain, setPain] = useState(3);
  const [notes, setNotes] = useState('');
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      const { data: patient } = await supabase.from('patients').select('id, clinic_id').eq('user_id', user.id).single();
      if (!patient) throw new Error('Patient not found');
      const { data: plan } = await supabase.from('plans').select('id').eq('patient_id', patient.id).eq('status','active').maybeSingle();

      const { sessionId: sid, signedUploadUrl } = await createSessionAndGetUploadUrl(patient.id, plan?.id ?? '');

      // Upload directly to Supabase Storage
      await fetch(signedUploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

      await markUploadComplete(sid);
      setSessionId(sid);
      setPatientId(patient.id);
      setClinicId(patient.clinic_id);
      toast.success('Video uploaded! ✓');
      setStep('checkin');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCheckin = async () => {
    if (!sessionId || !patientId || !clinicId) return;
    try {
      await submitCheckin({ sessionId, patientId, clinicId, painScore: pain, notes });
      toast.success('Check-in submitted ✓');
      setStep('done');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (step === 'done') return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg p-6 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="font-serif text-xl font-bold text-brand-text mb-2">Session Complete!</h1>
      <p className="text-sm text-brand-textLight mb-6">Your session is being processed. Check back soon for results.</p>
      <button onClick={() => router.push('/m/today')} className="rounded-xl bg-brand-coral px-6 py-3 text-sm font-bold text-white">Back to Today</button>
    </div>
  );

  if (step === 'checkin') return (
    <div className="min-h-screen bg-brand-bg p-6">
      <h1 className="font-serif text-xl font-bold text-brand-text mb-6">How did it feel?</h1>
      <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-card space-y-5">
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">Pain Level: {pain}/10</label>
          <input type="range" min={0} max={10} value={pain} onChange={e => setPain(Number(e.target.value))}
            className="w-full accent-brand-coral" />
          <div className="flex justify-between text-xs text-brand-textLight mt-1"><span>No pain</span><span>Worst pain</span></div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-text mb-2">Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="How did the session go?"
            className="w-full rounded-xl border border-brand-border p-3 text-sm outline-none focus:border-brand-coral" />
        </div>
        <button onClick={handleCheckin} className="w-full rounded-xl bg-brand-coral py-3 text-sm font-bold text-white">Submit Check-in</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <h1 className="font-serif text-xl font-bold text-brand-text mb-2">Record Session</h1>
      <p className="text-sm text-brand-textLight mb-6">Upload your session video for AI analysis.</p>
      <label className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-border bg-white p-10 cursor-pointer hover:border-brand-coral transition-colors ${uploading ? 'opacity-60' : ''}`}>
        <span className="text-4xl mb-3">{uploading ? '⚙️' : '🎬'}</span>
        <p className="text-sm font-semibold text-brand-text">{uploading ? 'Uploading…' : 'Tap to select video'}</p>
        <p className="text-xs text-brand-textLight mt-1">MP4, MOV, WebM · up to 500MB</p>
        <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
      </label>
    </div>
  );
}
