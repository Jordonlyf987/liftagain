import { PatientBottomNav } from '@/components/patient/PatientBottomNav';

// Auth is handled by middleware.ts — no need to check here
// This prevents redirect loops on /m/login and /m/onboarding

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-brand-bg">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <PatientBottomNav />
    </div>
  );
}
