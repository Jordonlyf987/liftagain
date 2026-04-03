'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/m/login'); };
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-sidebar px-5 pt-10 pb-6">
        <h1 className="font-serif text-xl font-bold text-white">Profile</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-2xl border border-brand-border bg-white divide-y divide-brand-border shadow-card">
          {['My Account','Notification Settings','Privacy & Consent','Help'].map(item => (
            <div key={item} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-brand-text">{item}</span>
              <span className="text-brand-textLight">›</span>
            </div>
          ))}
        </div>
        <button onClick={handleSignOut} className="w-full rounded-2xl border border-brand-border bg-white py-3 text-sm font-semibold text-brand-red shadow-card">
          Sign Out
        </button>
      </div>
    </div>
  );
}
