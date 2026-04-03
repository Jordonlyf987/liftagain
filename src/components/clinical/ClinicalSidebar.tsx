'use client';
// src/components/clinical/ClinicalSidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',        icon: '▦',  label: 'Dashboard' },
  { href: '/inbox',            icon: '⚡', label: 'Inbox',         badgeKey: 'alerts' },
  { href: '/patients',         icon: '👥', label: 'Patients' },
  { href: '/plans',            icon: '📋', label: 'Plans' },
  { href: '/exercise-library', icon: '🏋', label: 'Exercises' },
  { href: '/reports',          icon: '📊', label: 'Reports' },
  { href: '/messages',         icon: '💬', label: 'Messages' },
  { href: '/settings',         icon: '⚙',  label: 'Settings' },
  { href: '/audit-log',        icon: '📜', label: 'Audit Log' },
];

interface Props {
  profile: { full_name: string | null; role: string };
  clinicName: string;
  newAlertCount: number;
}

export function ClinicalSidebar({ profile, clinicName, newAlertCount }: Props) {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-48 flex-shrink-0 flex-col bg-brand-sidebar">
      <div className="border-b border-brand-sidebar2 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-coral to-brand-purple text-sm">⚡</div>
          <div>
            <div className="font-serif text-sm font-bold text-white">LiftAgain</div>
            <div className="text-[9px] text-brand-textLight">Clinical Platform</div>
          </div>
        </div>
      </div>
      <div className="border-b border-brand-sidebar2 p-2">
        <div className="rounded-md bg-brand-sidebar2 px-2 py-2">
          <div className="text-[9px] uppercase tracking-widest text-brand-textLight">Clinic</div>
          <div className="mt-0.5 text-xs font-semibold text-white">{clinicName}</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const badge = item.badgeKey === 'alerts' ? newAlertCount : 0;
          return (
            <Link key={item.href} href={item.href}
              className={`mb-0.5 flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-all
                ${active
                  ? 'border-l-[3px] border-brand-coral bg-brand-coral/10 font-bold text-brand-coral'
                  : 'border-l-[3px] border-transparent text-[#a09080] hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="w-4 text-center text-sm">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className="rounded-full bg-brand-coral px-1.5 py-0.5 text-[9px] font-bold text-white">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-brand-sidebar2 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-coral text-xs font-bold text-white">
            {(profile.full_name ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{profile.full_name}</div>
            <div className="text-[9px] capitalize text-brand-textLight">{profile.role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
