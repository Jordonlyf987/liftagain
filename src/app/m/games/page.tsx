export const metadata = { title: 'Games' };
export default function GamesPage() {
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-sidebar px-5 pt-10 pb-6">
        <h1 className="font-serif text-xl font-bold text-white">Rehab Games</h1>
      </div>
      <div className="p-4 flex flex-col items-center justify-center py-16">
        <p className="text-4xl mb-3">🎮</p>
        <p className="text-sm text-brand-textLight text-center">Interactive rehab games coming soon.</p>
      </div>
    </div>
  );
}
