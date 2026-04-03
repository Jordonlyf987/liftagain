'use client';
import { useRef, useState } from 'react';

interface VideoEvent { timestamp_s: number; label: string; confidence: number; severity: string }

export function VideoPlayer({ src, events = [], onSeek }: {
  src: string; events?: VideoEvent[]; onSeek?: (t: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause(); else videoRef.current.play();
    setPlaying(!playing);
  };
  const seekTo = (t: number) => { if (!videoRef.current) return; videoRef.current.currentTime = t; onSeek?.(t); };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col bg-black rounded-xl overflow-hidden">
      <div className="relative min-h-[260px]">
        <video ref={videoRef} src={src} className="h-full w-full object-contain"
          onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)} />
        {events.map((ev, i) => Math.abs(current - ev.timestamp_s) < 2.5 && (
          <div key={i} className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            ⚠️ {ev.label} at {fmt(ev.timestamp_s)}
          </div>
        ))}
        {!playing && (
          <button onClick={toggle} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-brand-coral/90 text-2xl text-white shadow-xl hover:bg-brand-coral">▶</button>
        )}
      </div>
      <div className="bg-[#181818] px-4 py-3">
        <div className="relative mb-3 h-8 cursor-pointer"
          onClick={ev => { const r = ev.currentTarget.getBoundingClientRect(); seekTo(((ev.clientX - r.left) / r.width) * duration); }}>
          <div className="absolute top-3 left-0 right-0 h-1.5 rounded-full bg-[#333]" />
          {duration > 0 && <div className="absolute top-3 left-0 h-1.5 rounded-full bg-brand-coral" style={{ width: `${(current/duration)*100}%` }} />}
          {duration > 0 && events.map((ev, i) => {
            const pct = (ev.timestamp_s / duration) * 100;
            const col = ev.severity === 'high' ? '#e03131' : ev.severity === 'medium' ? '#f59e0b' : '#2eb88a';
            return <div key={i} onClick={e => { e.stopPropagation(); seekTo(ev.timestamp_s); }}
              className="absolute top-1 h-5 w-5 -translate-x-1/2 cursor-pointer rounded-full border-2 border-[#181818] shadow-lg"
              style={{ left: `${pct}%`, background: col }} title={ev.label} />;
          })}
          {duration > 0 && <div className="pointer-events-none absolute top-0.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-brand-coral bg-white"
            style={{ left: `${(current/duration)*100}%` }} />}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="rounded bg-brand-coral px-3 py-1 text-xs font-bold text-white">{playing ? '⏸ Pause' : '▶ Play'}</button>
          <span className="font-mono text-xs text-gray-400">{fmt(current)} / {fmt(duration)}</span>
          <div className="ml-auto flex gap-1.5">
            {events.map((ev, i) => (
              <button key={i} onClick={() => seekTo(ev.timestamp_s)}
                className="rounded px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ background: ev.severity === 'high' ? '#e03131' : '#d97706' }}>
                ⚡ {fmt(ev.timestamp_s)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
