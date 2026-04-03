import Link from 'next/link';

interface PatientRow {
  patient_id: string;
  full_name: string;
  adherence_pct_30d: number | null;
  latest_pain_score: number | null;
  consecutive_missed_sessions: number | null;
  last_session_date: string | null;
}

interface Props { patients: PatientRow[] }

function AdherencePill({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-xs text-brand-textLight">—</span>;
  const color = pct >= 80 ? 'bg-brand-tealSoft text-brand-teal' : pct >= 50 ? 'bg-brand-yellowSoft text-yellow-700' : 'bg-brand-redSoft text-brand-red';
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{pct}%</span>;
}

export function PatientTable({ patients }: Props) {
  if (!patients.length) {
    return <div className="rounded-xl border border-brand-border bg-white p-8 text-center text-sm text-brand-textLight">No patients yet.</div>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-card">
      <div className="border-b border-brand-border px-4 py-3">
        <h2 className="font-serif text-sm font-bold text-brand-text">Patients</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-border bg-brand-bg text-xs text-brand-textLight">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Adherence (30d)</th>
            <th className="px-4 py-2 text-left font-medium">Last Pain</th>
            <th className="px-4 py-2 text-left font-medium">Missed</th>
            <th className="px-4 py-2 text-left font-medium">Last Session</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={p.patient_id} className={`border-b border-brand-border last:border-0 hover:bg-brand-bg ${i % 2 === 1 ? 'bg-brand-bg/40' : ''}`}>
              <td className="px-4 py-3">
                <Link href={`/patients/${p.patient_id}`} className="font-semibold text-brand-text hover:text-brand-coral">{p.full_name}</Link>
              </td>
              <td className="px-4 py-3"><AdherencePill pct={p.adherence_pct_30d} /></td>
              <td className="px-4 py-3">
                {p.latest_pain_score !== null ? (
                  <span className={`font-semibold ${p.latest_pain_score >= 7 ? 'text-brand-red' : p.latest_pain_score >= 4 ? 'text-yellow-600' : 'text-brand-teal'}`}>
                    {p.latest_pain_score}/10
                  </span>
                ) : <span className="text-brand-textLight">—</span>}
              </td>
              <td className="px-4 py-3">
                {(p.consecutive_missed_sessions ?? 0) > 0 ? (
                  <span className="font-semibold text-brand-red">{p.consecutive_missed_sessions} missed</span>
                ) : <span className="text-brand-teal">On track</span>}
              </td>
              <td className="px-4 py-3 text-brand-textLight">{p.last_session_date ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
