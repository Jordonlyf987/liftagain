'use client';
import { useState } from 'react';
import Link from 'next/link';

type Session = {
  id: string; status: string; scheduled_for?: string | null; video_path?: string | null;
  metrics?: { form_score?: number | null; rep_count?: number | null; avg_rom_degrees?: number | null } | null;
  events?: Array<{ id: string; timestamp_s: number; label: string; severity: string }>;
  job?: { status: string } | null;
};
type Plan = {
  id: string; name: string; sessions_per_week: number;
  exercises?: Array<{ id: string; sets: number; reps: number; exercise?: { name: string; category: string } | null }>;
} | null;

interface Props {
  patient: any; sessions: Session[]; activePlan: Plan;
  messages: any[]; checkins: any[]; adherenceSummary: any;
}

const STATUS_COLOR: Record<string, string> = {
  completed: 'bg-brand-tealSoft text-brand-teal',
  processing: 'bg-brand-yellowSoft text-yellow-700',
  uploaded: 'bg-brand-purpleSoft text-brand-purple',
  failed: 'bg-brand-redSoft text-brand-red',
  skipped: 'bg-brand-bg text-brand-textLight',
  scheduled: 'bg-brand-bg text-brand-textLight',
};

export function PatientProfileClient({ patient, sessions, activePlan, messages, checkins, adherenceSummary }: Props) {
  const [tab, setTab] = useState<'sessions'|'plan'|'messages'>('sessions');

  const adh = adherenceSummary;

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3 flex items-center gap-3">
        <Link href="/patients" className="text-brand-textLight hover:text-brand-coral text-sm">← Patients</Link>
        <span className="text-brand-border">/</span>
        <h1 className="font-serif text-lg font-bold text-brand-text">{patient.full_name}</h1>
      </header>

      <div className="p-6 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Adherence 30d', value: adh?.adherence_pct_30d != null ? `${adh.adherence_pct_30d}%` : '—', color: 'text-brand-teal' },
            { label: 'Latest Pain', value: adh?.latest_pain_score != null ? `${adh.latest_pain_score}/10` : '—', color: adh?.latest_pain_score >= 7 ? 'text-brand-red' : 'text-brand-teal' },
            { label: 'Missed Sessions', value: adh?.consecutive_missed_sessions ?? 0, color: adh?.consecutive_missed_sessions > 0 ? 'text-brand-red' : 'text-brand-teal' },
            { label: 'Last Session', value: adh?.last_session_date ?? '—', color: 'text-brand-text' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-brand-border bg-white p-3 shadow-card">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-brand-textLight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-brand-border">
          {(['sessions','plan','messages'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2 px-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-brand-coral text-brand-coral' : 'text-brand-textLight hover:text-brand-text'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Sessions tab */}
        {tab === 'sessions' && (
          <div className="space-y-2">
            {sessions.length === 0 && <p className="text-sm text-brand-textLight">No sessions yet.</p>}
            {sessions.map(s => (
              <div key={s.id} className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[s.status] ?? ''}`}>{s.status}</span>
                    <span className="text-sm text-brand-textMid">{s.scheduled_for ?? 'No date'}</span>
                  </div>
                  {s.metrics && (
                    <div className="flex gap-4 text-xs text-brand-textLight">
                      <span>Form: <b className="text-brand-text">{s.metrics.form_score != null ? `${Math.round(s.metrics.form_score * 100)}%` : '—'}</b></span>
                      <span>Reps: <b className="text-brand-text">{s.metrics.rep_count ?? '—'}</b></span>
                      <span>ROM: <b className="text-brand-text">{s.metrics.avg_rom_degrees != null ? `${s.metrics.avg_rom_degrees}°` : '—'}</b></span>
                    </div>
                  )}
                </div>
                {s.events && s.events.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.events.map(e => (
                      <span key={e.id} className="rounded bg-brand-redSoft px-2 py-0.5 text-[10px] text-brand-red">
                        {e.label} @ {Math.floor(e.timestamp_s / 60)}:{String(Math.floor(e.timestamp_s % 60)).padStart(2,'0')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Plan tab */}
        {tab === 'plan' && (
          <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
            {!activePlan ? <p className="text-sm text-brand-textLight">No active plan.</p> : (
              <>
                <h3 className="font-serif text-sm font-bold text-brand-text mb-1">{activePlan.name}</h3>
                <p className="text-xs text-brand-textLight mb-3">{activePlan.sessions_per_week}x per week</p>
                <div className="space-y-2">
                  {activePlan.exercises?.map((ex, i) => (
                    <div key={ex.id} className="flex items-center gap-3 rounded-lg border border-brand-border px-3 py-2">
                      <span className="text-xs font-bold text-brand-textLight w-5">{i+1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-text">{ex.exercise?.name}</p>
                        <p className="text-xs text-brand-textLight">{ex.sets} sets × {ex.reps} reps · {ex.exercise?.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Messages tab */}
        {tab === 'messages' && (
          <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card space-y-3">
            {messages.length === 0 && <p className="text-sm text-brand-textLight">No messages yet.</p>}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender_type === 'therapist' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${m.sender_type === 'therapist' ? 'bg-brand-coral text-white' : 'bg-brand-bg text-brand-text border border-brand-border'}`}>
                  {m.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
