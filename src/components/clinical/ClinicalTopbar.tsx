'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Props { title?: string }

export function ClinicalTopbar({ title }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  return (
    <div className="flex items-center justify-between border-b border-brand-border bg-white px-6 py-3">
      {title && <h1 className="font-serif text-lg font-bold text-brand-text">{title}</h1>}
      <div className="ml-auto">
        <button onClick={handleSignOut} className="text-xs text-brand-textLight hover:text-brand-text">Sign out</button>
      </div>
    </div>
  );
}
