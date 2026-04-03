'use client';
// src/app/m/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function PatientLoginPage() {
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
    router.push('/m/today');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-coral to-brand-purple text-2xl shadow-xl">⚡</div>
        <h1 className="font-serif text-3xl font-bold text-brand-text">LiftAgain</h1>
        <p className="mt-1 text-sm text-brand-textLight">Your rehab companion</p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-7 shadow-card">
        {error && <div className="mb-4 rounded-lg bg-brand-redSoft p-3 text-sm text-brand-red">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="Your email"
            className="w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none focus:border-brand-coral focus:ring-2 focus:ring-brand-coral" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            placeholder="Password"
            className="w-full rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-sm outline-none focus:border-brand-coral focus:ring-2 focus:ring-brand-coral" />
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-coral to-[#c94f2a] py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-brand-textLight">
          New patient? Your clinic will send you a QR code to join.
        </p>
      </div>
      <a href="/login" className="mt-4 text-xs text-brand-textLight underline">Are you a physiotherapist?</a>
    </div>
  );
}
