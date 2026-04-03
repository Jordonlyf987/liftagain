import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Messages' };
export const dynamic = 'force-dynamic';
export default async function MessagesPage() {
  const supabase = createClient();
  const { data: patients } = await supabase.from('patients').select('id, full_name').eq('is_active', true).order('full_name');
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Messages</h1>
      </header>
      <div className="p-6 space-y-2">
        {(patients ?? []).map(p => (
          <a key={p.id} href={`/patients/${p.id}`}
            className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4 shadow-card hover:border-brand-coral">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-coralSoft font-bold text-brand-coral text-sm">
              {p.full_name.charAt(0)}
            </div>
            <span className="text-sm font-semibold text-brand-text">{p.full_name}</span>
            <span className="ml-auto text-brand-textLight text-xs">›</span>
          </a>
        ))}
      </div>
    </div>
  );
}
