'use client';
// src/app/m/onboarding/page.tsx
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Step = 'code' | 'consent' | 'camera' | 'guide' | 'done';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep]             = useState<Step>('code');
  const [inviteCode, setInviteCode] = useState(searchParams.get('token') ?? '');
  const [consentVideo, setCV]       = useState(false);
  const [consentSharing, setCS]     = useState(false);
  const [joining, setJoining]       = useState(false);
  const [error, setError]           = useState('');

  const handleJoin = async () => {
    setJoining(true); setError('');
    const { data: patient, error: lookupErr } = await supabase
      .from('patients').select('id, clinic_id')
      .eq('invite_code', inviteCode.toLowerCase().trim())
      .eq('invite_used', false).single();
    if (lookupErr || !patient) {
      setError('Invalid or already-used invite code. Check with your physiotherapist.');
      setJoining(false); return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('patients').update({ user_id: user.id, invite_used: true }).eq('id', patient.id);
      await supabase.from('profiles').update({ clinic_id: patient.clinic_id, role: 'patient' }).eq('id', user.id);
    }
    setStep('consent'); setJoining(false);
  };

  const handleConsent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
    if (patient) {
      await supabase.from('patients').update({
        consent_video: consentVideo, consent_sharing: consentSharing,
        consent_at: new Date().toISOString(),
      }).eq('id', patient.id);
    }
    setStep('camera');
  };

  return (
    <div className="min-h-screen bg-brand-bg px-5 py-8">
      {/* Progress dots */}
      <div className="mb-8 flex justify-center gap-2">
        {(['code','consent','camera','guide'] as Step[]).map((s, i) => (
          <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-6 bg-brand-coral' : 'w-2 bg-brand-border'}`} />
        ))}
      </div>

      <div className="mx-auto max-w-sm">
        {/* Step: invite code */}
        {step === 'code' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-4 text-5xl">🔗</div>
              <h2 className="font-serif text-2xl font-bold text-brand-text">Join your clinic</h2>
              <p className="mt-2 text-sm text-brand-textLight">Enter the invite code from your physiotherapist, or scan their QR code.</p>
            </div>
            {error && <div className="rounded-xl bg-brand-redSoft p-3 text-sm text-brand-red">{error}</div>}
            <input value={inviteCode} onChange={e => { setInviteCode(e.target.value); setError(''); }}
              placeholder="Enter invite code (e.g. invite-john-01)"
              className="w-full rounded-xl border-2 border-brand-border bg-brand-bg px-4 py-4 text-center font-mono text-lg tracking-wider outline-none focus:border-brand-coral" />
            <button onClick={handleJoin} disabled={!inviteCode.trim() || joining}
              className="w-full rounded-xl bg-brand-coral py-4 text-sm font-bold text-white disabled:opacity-60">
              {joining ? 'Verifying…' : 'Join Clinic →'}
            </button>
            <p className="text-center text-xs text-brand-textLight">Demo code: invite-john-01</p>
          </div>
        )}

        {/* Step: consent */}
        {step === 'consent' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-4 text-5xl">📋</div>
              <h2 className="font-serif text-2xl font-bold text-brand-text">Before we begin</h2>
              <p className="mt-2 text-sm text-brand-textLight">Please review and accept the following to continue.</p>
            </div>
            {[
              { label: 'I consent to recording my exercise sessions for physiotherapy review.', state: consentVideo, set: setCV },
              { label: 'I consent to sharing my session data and progress with my assigned physiotherapist.', state: consentSharing, set: setCS },
            ].map((item, i) => (
              <label key={i} onClick={() => item.set(!item.state)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${item.state ? 'border-brand-coral bg-brand-coralSoft' : 'border-brand-border bg-white'}`}>
                <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${item.state ? 'border-brand-coral bg-brand-coral' : 'border-brand-borderMid bg-transparent'}`}>
                  {item.state && <span className="text-[10px] font-bold text-white">✓</span>}
                </div>
                <span className="text-sm leading-relaxed text-brand-text">{item.label}</span>
              </label>
            ))}
            <button onClick={handleConsent} disabled={!consentVideo || !consentSharing}
              className="w-full rounded-xl bg-brand-coral py-4 text-sm font-bold text-white disabled:opacity-50">
              I Accept & Continue →
            </button>
          </div>
        )}

        {/* Step: camera */}
        {step === 'camera' && (
          <div className="space-y-5 text-center">
            <div className="mx-auto text-6xl">📷</div>
            <h2 className="font-serif text-2xl font-bold text-brand-text">Camera access</h2>
            <p className="text-sm leading-relaxed text-brand-textLight">LiftAgain needs camera access to record your sessions so your physiotherapist can review your form between appointments.</p>
            <div className="rounded-xl border border-brand-border bg-brand-bg p-4 text-left text-sm text-brand-textMid space-y-2">
              <div>✅ <strong>Your videos are private</strong> — only your physiotherapist can see them</div>
              <div>✅ <strong>Stored securely</strong> — encrypted in Singapore-region servers</div>
              <div>✅ <strong>Never shared</strong> without your consent</div>
            </div>
            <button onClick={() => setStep('guide')}
              className="w-full rounded-xl bg-brand-coral py-4 text-sm font-bold text-white">
              Allow Camera & Continue →
            </button>
          </div>
        )}

        {/* Step: safety guide */}
        {step === 'guide' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-3 text-5xl">💪</div>
              <h2 className="font-serif text-2xl font-bold text-brand-text">How to record</h2>
              <p className="mt-1 text-sm text-brand-textLight">Follow these tips for the best results.</p>
            </div>
            {[
              { icon: '💡', title: 'Good lighting', desc: 'Face a window or bright lamp so your movements are clearly visible.' },
              { icon: '📱', title: 'Stable phone', desc: 'Prop your phone against something firm. Landscape mode works best for full-body exercises.' },
              { icon: '🧍', title: 'Full body in frame', desc: 'Make sure your entire body fits in the camera view before starting.' },
              { icon: '🛑', title: 'Stop if it hurts', desc: 'If pain spikes above 6/10, stop immediately and use the pain check-in to alert your PT.' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-brand-border bg-white p-4">
                <span className="flex-shrink-0 text-2xl">{tip.icon}</span>
                <div>
                  <div className="text-sm font-bold text-brand-text">{tip.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-brand-textMid">{tip.desc}</div>
                </div>
              </div>
            ))}
            <button onClick={() => router.push('/m/today')}
              className="w-full rounded-xl bg-gradient-to-r from-brand-coral to-[#c94f2a] py-4 text-sm font-bold text-white shadow-lg">
              I'm Ready — Let's Go! 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
