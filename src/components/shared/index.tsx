// Shared UI components — all server-safe (no hooks)
// VideoPlayer is in ./VideoPlayer.tsx (client component)

// ── LoadingSkeleton ─────────────────────────────────────────
interface SkeletonProps { rows?: number; cols?: number; className?: string }
export function LoadingSkeleton({ rows = 5, cols = 1, className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-3 p-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-10 animate-pulse rounded-lg bg-brand-border" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── EmptyState ──────────────────────────────────────────────
interface EmptyStateProps {
  icon: string; title: string; description: string;
  action?: { label: string; onClick: () => void };
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 font-serif text-lg font-bold text-brand-text">{title}</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-brand-textLight">{description}</p>
      {action && (
        <button onClick={action.onClick}
          className="rounded-lg bg-brand-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-coral/90">
          {action.label}
        </button>
      )}
    </div>
  );
}

// ── SeverityBadge / StatusBadge ─────────────────────────────
type Severity = 'low' | 'medium' | 'high';
type AlertStatus = 'new' | 'in_review' | 'resolved';

export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    high:   'bg-brand-redSoft text-brand-red',
    medium: 'bg-brand-yellowSoft text-amber-700',
    low:    'bg-brand-tealSoft text-brand-teal',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${styles[severity]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: AlertStatus }) {
  const styles: Record<AlertStatus, string> = {
    new:       'bg-brand-coralSoft text-brand-coral',
    in_review: 'bg-brand-purpleSoft text-brand-purple',
    resolved:  'bg-brand-tealSoft text-brand-teal',
  };
  const labels: Record<AlertStatus, string> = { new: 'New', in_review: 'In Review', resolved: 'Resolved' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// ── Avatar ──────────────────────────────────────────────────
const COLORS = ['#e8633a','#7c4dff','#2eb88a','#f5c518','#e03131','#0891b2'];
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const bg = COLORS[name.charCodeAt(0) % COLORS.length];
  const sizeClass = size === 'sm' ? 'h-6 w-6 text-[9px]' : size === 'lg' ? 'h-12 w-12 text-lg' : 'h-8 w-8 text-xs';
  return (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass}`} style={{ background: bg }}>
      {initials}
    </div>
  );
}

// ── AdherenceBar ────────────────────────────────────────────
export function AdherenceBar({ pct, showLabel = true }: { pct: number; showLabel?: boolean }) {
  const color = pct > 80 ? 'bg-brand-teal' : pct > 50 ? 'bg-brand-yellow' : 'bg-brand-red';
  const textColor = pct > 80 ? 'text-brand-teal' : pct > 50 ? 'text-amber-600' : 'text-brand-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-10 overflow-hidden rounded-full bg-brand-border">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>}
    </div>
  );
}
