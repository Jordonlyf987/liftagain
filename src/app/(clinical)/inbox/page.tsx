import { createClient } from '@/lib/supabase/server';
import { InboxClient } from '@/components/clinical/InboxClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Alerts Inbox' };
export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const supabase = createClient();

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*, patient:patients(id, full_name, phone), session:sessions(id, scheduled_for, status, video_path)')
    .order('created_at', { ascending: false })
    .limit(100);

  const counts = {
    new:       alerts?.filter(a => a.status === 'new').length ?? 0,
    in_review: alerts?.filter(a => a.status === 'in_review').length ?? 0,
    resolved:  alerts?.filter(a => a.status === 'resolved').length ?? 0,
  };

  return <InboxClient initialAlerts={alerts ?? []} counts={counts} />;
}
