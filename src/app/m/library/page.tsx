import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Library' };
export default async function LibraryPage() {
  const supabase = createClient();
  const { data: exercises } = await supabase.from('exercises').select('*').order('name');
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-sidebar px-5 pt-10 pb-6">
        <h1 className="font-serif text-xl font-bold text-white">Exercise Library</h1>
      </div>
      <div className="p-4 space-y-3">
        {(exercises ?? []).map((ex: any) => (
          <div key={ex.id} className="rounded-2xl border border-brand-border bg-white p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coralSoft text-xl">🏋</div>
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-wide text-brand-textLight">{ex.category}</span>
                <h3 className="font-serif text-sm font-bold text-brand-text">{ex.name}</h3>
                <p className="text-xs text-brand-textLight mt-0.5 line-clamp-2">{ex.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
