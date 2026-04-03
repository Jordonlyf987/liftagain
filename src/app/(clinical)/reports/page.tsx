export const metadata = { title: 'Reports' };
export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Reports</h1>
      </header>
      <div className="p-6">
        <div className="rounded-xl border border-brand-border bg-white p-8 text-center shadow-card">
          <p className="text-3xl mb-3">📊</p>
          <h2 className="font-serif text-base font-bold text-brand-text mb-1">Analytics & Reports</h2>
          <p className="text-sm text-brand-textLight">View clinic-wide adherence trends, session quality metrics, and patient outcomes.</p>
        </div>
      </div>
    </div>
  );
}
