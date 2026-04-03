interface Props { count: number; className?: string }
export function AlertBanner({ count, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-brand-coral/30 bg-brand-coralSoft px-4 py-3 ${className}`}>
      <span className="text-xl">⚡</span>
      <p className="text-sm font-semibold text-brand-coral">
        {count} new alert{count !== 1 ? 's' : ''} require your attention
      </p>
      <a href="/inbox" className="ml-auto text-xs font-bold text-brand-coral underline">Review inbox →</a>
    </div>
  );
}
