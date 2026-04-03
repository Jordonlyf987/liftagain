interface Props { newAlerts: number; sessionsToday: number; activePatients: number }
export function DashboardMetrics({ newAlerts, sessionsToday, activePatients }: Props) {
  const cards = [
    { label: 'New Alerts', value: newAlerts, color: 'bg-brand-coralSoft text-brand-coral', icon: '⚡' },
    { label: 'Sessions Today', value: sessionsToday, color: 'bg-brand-tealSoft text-brand-teal', icon: '🎬' },
    { label: 'Active Patients', value: activePatients, color: 'bg-brand-purpleSoft text-brand-purple', icon: '👥' },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border border-brand-border bg-white p-4 shadow-card">
          <div className={`mb-2 inline-flex rounded-lg p-2 text-xl ${c.color}`}>{c.icon}</div>
          <div className="text-2xl font-bold text-brand-text">{c.value}</div>
          <div className="text-xs text-brand-textLight">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
