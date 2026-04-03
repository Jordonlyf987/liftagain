import { createClient } from '@/lib/supabase/server';
export const metadata = { title: 'Exercise Library' };
export default async function ExerciseLibraryPage() {
  const supabase = createClient();
  const { data: exercises } = await supabase.from('exercises').select('*').order('name');
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Exercise Library</h1>
      </header>
      <div className="p-6 grid grid-cols-2 gap-3">
        {(exercises ?? []).map(ex => (
          <div key={ex.id} className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
            <span className="rounded-full bg-brand-coralSoft px-2 py-0.5 text-[10px] font-semibold text-brand-coral uppercase">{ex.category}</span>
            <h3 className="mt-2 font-serif text-sm font-bold text-brand-text">{ex.name}</h3>
            <p className="mt-1 text-xs text-brand-textLight line-clamp-2">{ex.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
