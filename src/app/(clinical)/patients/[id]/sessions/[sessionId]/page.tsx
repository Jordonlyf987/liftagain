import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SessionReviewPage({ params }: { params: { id: string; sessionId: string } }) {
  const supabase = createClient();
  const { data: session } = await supabase
    .from('sessions')
    .select('*, metrics:session_metrics(*), events:session_events(*), patient:patients(full_name, id)')
    .eq('id', params.sessionId)
    .single();

  if (!session) notFound();

  let signedVideoUrl: string | null = null;
  if (session.video_path) {
    const { data } = await supabase.storage.from('session-videos').createSignedUrl(session.video_path, 3600);
    signedVideoUrl = data?.signedUrl ?? null;
  }

  const metrics = session.metrics as any;
  const events = (session.events as any[]) ?? [];

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3 flex items-center gap-3">
        <Link href={`/patients/${params.id}`} className="text-brand-textLight hover:text-brand-coral text-sm">← Patient</Link>
        <span className="text-brand-border">/</span>
        <h1 className="font-serif text-base font-bold text-brand-text">Session Review</h1>
        <span className="text-xs text-brand-textLight ml-2">{session.scheduled_for}</span>
      </header>

      <div className="p-6 space-y-4">
        {/* Video */}
        <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
          <h2 className="font-serif text-sm font-bold text-brand-text mb-3">Session Video</h2>
          {signedVideoUrl ? (
            <video controls className="w-full rounded-lg max-h-64 bg-black" src={signedVideoUrl} />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-brand-bg text-brand-textLight text-sm">No video available</div>
          )}
        </div>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Form Score', value: metrics.form_score != null ? `${Math.round(metrics.form_score * 100)}%` : '—', warn: metrics.form_score < 0.65 },
              { label: 'Reps', value: `${metrics.rep_count ?? '—'} / ${metrics.prescribed_reps ?? '—'}` },
              { label: 'Avg ROM', value: metrics.avg_rom_degrees != null ? `${metrics.avg_rom_degrees}°` : '—' },
              { label: 'Confidence', value: metrics.low_confidence ? 'Low ⚠️' : 'Good ✓' },
            ].map(m => (
              <div key={m.label} className="rounded-xl border border-brand-border bg-white p-3 shadow-card">
                <div className={`text-xl font-bold ${(m as any).warn ? 'text-brand-red' : 'text-brand-text'}`}>{m.value}</div>
                <div className="text-xs text-brand-textLight">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
            <h2 className="font-serif text-sm font-bold text-brand-text mb-3">⚠️ Flagged Events</h2>
            <div className="space-y-2">
              {events.map((e: any) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg border border-brand-border px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${e.severity === 'high' ? 'bg-brand-redSoft text-brand-red' : e.severity === 'medium' ? 'bg-brand-yellowSoft text-yellow-700' : 'bg-brand-tealSoft text-brand-teal'}`}>
                    {e.severity}
                  </span>
                  <span className="font-mono text-xs text-brand-textLight">
                    {Math.floor(e.timestamp_s / 60)}:{String(Math.floor(e.timestamp_s % 60)).padStart(2,'0')}
                  </span>
                  <span className="text-sm text-brand-text">{e.label.replace(/_/g, ' ')}</span>
                  <span className="ml-auto text-xs text-brand-textLight">{Math.round(e.confidence * 100)}% conf.</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
