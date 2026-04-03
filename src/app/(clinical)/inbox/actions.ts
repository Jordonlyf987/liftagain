'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function resolveAlert(alertId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase
    .from('alerts')
    .update({ status: 'resolved', resolved_by: user.id, resolved_at: new Date().toISOString() })
    .eq('id', alertId);

  const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', user.id).single();
  await supabase.from('audit_logs').insert({
    clinic_id: profile?.clinic_id!,
    actor_id: user.id,
    action: 'alert.resolved',
    entity_type: 'alert',
    entity_id: alertId,
  });

  revalidatePath('/inbox');
  revalidatePath('/dashboard');
}

export async function markAlertInReview(alertId: string) {
  const supabase = createClient();
  await supabase.from('alerts').update({ status: 'in_review' }).eq('id', alertId);
  revalidatePath('/inbox');
}
