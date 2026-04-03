'use client';
export function QuickActions() {
  const actions = [
    { label: 'Add Patient', href: '/patients', icon: '➕' },
    { label: 'View Reports', href: '/reports', icon: '📊' },
    { label: 'Exercise Library', href: '/exercise-library', icon: '🏋' },
  ];
  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
      <h2 className="mb-3 font-serif text-sm font-bold text-brand-text">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map(a => (
          <a key={a.href} href={a.href}
            className="flex items-center gap-3 rounded-lg border border-brand-border px-3 py-2 text-xs font-medium text-brand-textMid hover:border-brand-coral hover:text-brand-coral">
            <span>{a.icon}</span>{a.label}
          </a>
        ))}
      </div>
    </div>
  );
}
