'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/m/today',    icon: '🏠', label: 'Today' },
  { href: '/m/progress', icon: '📈', label: 'Progress' },
  { href: '/m/library',  icon: '📚', label: 'Library' },
  { href: '/m/profile',  icon: '👤', label: 'Profile' },
];

export function PatientBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-brand-border bg-white">
      {NAV.map(item => {
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-center transition-colors
              ${active ? 'text-brand-coral' : 'text-brand-textLight hover:text-brand-text'}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
