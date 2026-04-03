export const metadata = { title: 'Settings' };
export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg">
      <header className="sticky top-0 z-10 border-b border-brand-border bg-white px-6 py-3">
        <h1 className="font-serif text-lg font-bold text-brand-text">Settings</h1>
      </header>
      <div className="p-6 space-y-4">
        {['Clinic Profile','Alert Thresholds','Notification Preferences','Team Members','Billing'].map(s => (
          <div key={s} className="rounded-xl border border-brand-border bg-white p-4 shadow-card flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-text">{s}</span>
            <span className="text-brand-textLight">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
