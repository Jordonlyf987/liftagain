'use client';
// src/app/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Metadata } from 'next';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-coral to-brand-purple text-2xl shadow-lg">⚡</div>
          <h1 className="font-serif text-2xl font-bold text-brand-text">LiftAgain</h1>
          <p className="mt-1 text-sm text-brand-textLight">Clinical Dashboard</p>
        </div>
        <div className="rounded-2xl border border-brand-border bg-white p-8 shadow-card">
          <h2 className="mb-6 font-serif text-xl font-bold text-brand-text">Sign in to your clinic</h2>
          {error && <div className="mb-4 rounded-lg border border-brand-red/20 bg-brand-redSoft p-3 text-sm text-brand-red">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-textLight">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm outline-none focus:border-brand-coral focus:ring-2 focus:ring-brand-coral"
                placeholder="doctor@clinic.sg" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-textLight">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-sm outline-none focus:border-brand-coral focus:ring-2 focus:ring-brand-coral"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-brand-coral py-3 text-sm font-bold text-white shadow-md hover:bg-brand-coral/90 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-brand-textLight">
            Patient? <a href="/m/login" className="font-semibold text-brand-coral">Open patient app</a>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-brand-border bg-white/60 p-4 text-xs text-brand-textMid">
          <div className="mb-2 font-bold text-brand-text">Demo accounts</div>
          <div>Admin: anita@peakphysio.sg / Demo1234!</div>
          <div>Therapist: miller@peakphysio.sg / Demo1234!</div>
        </div>
      </div>
    </div>
  );
}
