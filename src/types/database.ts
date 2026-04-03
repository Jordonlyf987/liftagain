// src/types/database.ts
// Auto-generated TypeScript types matching 01_schema.sql
// Regenerate with: npx supabase gen types typescript --project-id YOUR_ID > src/types/database.ts

export type UserRole = 'clinic_admin' | 'therapist' | 'assistant' | 'patient';
export type AlertType = 'non_adherence' | 'pain_spike' | 'form_fail' | 'processing_failed';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'new' | 'in_review' | 'resolved';
export type SessionStatus = 'scheduled' | 'uploaded' | 'processing' | 'completed' | 'failed' | 'skipped';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type PlanStatus = 'active' | 'paused' | 'completed' | 'archived';
export type MessageSender = 'therapist' | 'patient';

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          address: string | null;
          timezone: string;
          pain_spike_threshold: number;
          pain_delta_threshold: number;
          non_adherence_days_medium: number;
          non_adherence_days_high: number;
          form_score_threshold: number;
          data_retention_days: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clinics']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['clinics']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          clinic_id: string | null;
          role: UserRole;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          is_active: boolean;
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      therapist_profiles: {
        Row: {
          id: string;
          user_id: string;
          clinic_id: string;
          specialisation: string | null;
          license_number: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['therapist_profiles']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['therapist_profiles']['Insert']>;
      };
      patients: {
        Row: {
          id: string;
          user_id: string | null;
          clinic_id: string;
          therapist_id: string | null;
          full_name: string;
          date_of_birth: string | null;
          phone: string | null;
          invite_code: string | null;
          invite_used: boolean;
          consent_video: boolean;
          consent_sharing: boolean;
          consent_at: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['patients']['Insert']>;
      };
      exercises: {
        Row: {
          id: string;
          clinic_id: string | null;
          name: string;
          description: string | null;
          category: string | null;
          instructions: string[] | null;
          cues: string[] | null;
          common_mistakes: string[] | null;
          demo_video_url: string | null;
          thumbnail_url: string | null;
          target_rom_notes: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
      plans: {
        Row: {
          id: string;
          patient_id: string;
          clinic_id: string;
          therapist_id: string | null;
          template_id: string | null;
          name: string;
          description: string | null;
          status: PlanStatus;
          start_date: string | null;
          end_date: string | null;
          sessions_per_week: number;
          version: number;
          parent_plan_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['plans']['Insert']>;
      };
      plan_exercises: {
        Row: {
          id: string;
          plan_id: string;
          exercise_id: string;
          order_index: number;
          sets: number;
          reps: number;
          rest_seconds: number;
          duration_seconds: number | null;
          notes: string | null;
          pain_stop_rule: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plan_exercises']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['plan_exercises']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          patient_id: string;
          plan_id: string | null;
          clinic_id: string;
          scheduled_for: string | null;
          status: SessionStatus;
          video_path: string | null;
          video_duration_s: number | null;
          deleted_at: string | null;
          therapist_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      processing_jobs: {
        Row: {
          id: string;
          session_id: string;
          status: JobStatus;
          attempt_count: number;
          last_error: string | null;
          queued_at: string;
          started_at: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['processing_jobs']['Row'], 'id' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['processing_jobs']['Insert']>;
      };
      session_metrics: {
        Row: {
          id: string;
          session_id: string;
          patient_id: string;
          clinic_id: string;
          rep_count: number | null;
          prescribed_reps: number | null;
          form_score: number | null;
          avg_rom_degrees: number | null;
          low_confidence: boolean;
          raw_output: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['session_metrics']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['session_metrics']['Insert']>;
      };
      session_events: {
        Row: {
          id: string;
          session_id: string;
          patient_id: string;
          timestamp_s: number;
          label: string;
          confidence: number | null;
          severity: AlertSeverity | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['session_events']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['session_events']['Insert']>;
      };
      checkins: {
        Row: {
          id: string;
          session_id: string | null;
          patient_id: string;
          clinic_id: string;
          pain_score: number;
          pain_areas: string[] | null;
          notes: string | null;
          submitted_at: string;
        };
        Insert: Omit<Database['public']['Tables']['checkins']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['checkins']['Insert']>;
      };
      alerts: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          session_id: string | null;
          therapist_id: string | null;
          type: AlertType;
          severity: AlertSeverity;
          status: AlertStatus;
          reason: string;
          recommended_action: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['alerts']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['alerts']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          patient_id: string;
          clinic_id: string;
          sender_id: string;
          sender_type: MessageSender;
          body: string;
          is_template: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          clinic_id: string;
          actor_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: never; // audit logs are immutable
      };
      analytics_events: {
        Row: {
          id: string;
          clinic_id: string | null;
          patient_id: string | null;
          session_id: string | null;
          event_name: string;
          properties: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analytics_events']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: never;
      };
    };
    Views: {
      patient_adherence_summary: {
        Row: {
          patient_id: string;
          clinic_id: string;
          full_name: string;
          therapist_id: string | null;
          plan_id: string | null;
          sessions_per_week: number | null;
          sessions_completed_7d: number;
          sessions_missed_7d: number;
          adherence_pct_30d: number | null;
          last_session_date: string | null;
          latest_pain_score: number | null;
          consecutive_missed_sessions: number;
        };
      };
    };
    Functions: {
      auth_user_role: { Args: Record<never, never>; Returns: UserRole };
      auth_user_clinic_id: { Args: Record<never, never>; Returns: string };
      auth_patient_id: { Args: Record<never, never>; Returns: string };
      auth_therapist_profile_id: { Args: Record<never, never>; Returns: string };
      is_clinic_admin: { Args: { p_clinic_id: string }; Returns: boolean };
      is_clinic_staff: { Args: { p_clinic_id: string }; Returns: boolean };
      is_assigned_therapist: { Args: { p_patient_id: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      alert_type: AlertType;
      alert_severity: AlertSeverity;
      alert_status: AlertStatus;
      session_status: SessionStatus;
      job_status: JobStatus;
      plan_status: PlanStatus;
      message_sender: MessageSender;
    };
  };
}

// ── Convenience types ──────────────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Clinic            = Tables<'clinics'>;
export type Profile           = Tables<'profiles'>;
export type TherapistProfile  = Tables<'therapist_profiles'>;
export type Patient           = Tables<'patients'>;
export type Exercise          = Tables<'exercises'>;
export type Plan              = Tables<'plans'>;
export type PlanExercise      = Tables<'plan_exercises'>;
export type Session           = Tables<'sessions'>;
export type ProcessingJob     = Tables<'processing_jobs'>;
export type SessionMetrics    = Tables<'session_metrics'>;
export type SessionEvent      = Tables<'session_events'>;
export type Checkin           = Tables<'checkins'>;
export type Alert             = Tables<'alerts'>;
export type Message           = Tables<'messages'>;
export type AuditLog          = Tables<'audit_logs'>;

// ── Joined / enriched types ────────────────────────────────────
export type PatientWithAdherence = Patient & {
  adherence_pct_30d: number | null;
  latest_pain_score: number | null;
  last_session_date: string | null;
  consecutive_missed_sessions: number;
  therapist?: TherapistProfile & { profile: Profile };
  active_plan?: Plan;
};

export type SessionWithMetrics = Session & {
  metrics?: SessionMetrics;
  events?: SessionEvent[];
  checkin?: Checkin;
  processing_job?: ProcessingJob;
  signed_video_url?: string; // generated server-side
};

export type AlertWithPatient = Alert & {
  patient: Pick<Patient, 'id' | 'full_name' | 'clinic_id'>;
  session?: Pick<Session, 'id' | 'scheduled_for' | 'status'>;
};
