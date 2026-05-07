// Auto-generated types from Supabase schema.
// Regenerate after schema changes: npm run db:generate-types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      operators: {
        Row: {
          id:              string;
          operator_id:     string;
          full_name:       string;
          email:           string;
          license_number:  string | null;
          state:           string | null;
          track:           string;
          role:            string;
          mfa_enabled:     boolean;
          enrolled_at:     string;
          commander_email: string | null;
          created_at:      string;
          updated_at:      string;
        };
        Insert: {
          id:              string;
          operator_id:     string;
          full_name:       string;
          email:           string;
          license_number?: string | null;
          state?:          string | null;
          track?:          string;
          role?:           string;
          mfa_enabled?:    boolean;
          commander_email?: string | null;
        };
        Update: {
          operator_id?:    string;
          full_name?:      string;
          email?:          string;
          license_number?: string | null;
          state?:          string | null;
          track?:          string;
          role?:           string;
          mfa_enabled?:    boolean;
          commander_email?: string | null;
          updated_at?:     string;
        };
        Relationships: [];
      };
      mjm_modules: {
        Row: {
          id:                    string;
          title:                 string;
          description:           string | null;
          sequence_order:        number;
          track:                 string;
          scorm_course_id:       string;
          passing_score:         number;
          critical_question_ids: string[];
          duration_hours:        number | null;
          is_active:             boolean;
          created_at:            string;
        };
        Insert: {
          id:                    string;
          title:                 string;
          description?:          string | null;
          sequence_order:        number;
          track:                 string;
          scorm_course_id:       string;
          passing_score?:        number;
          critical_question_ids?: string[];
          duration_hours?:       number | null;
          is_active?:            boolean;
        };
        Update: {
          title?:                string;
          description?:          string | null;
          sequence_order?:       number;
          track?:                string;
          scorm_course_id?:      string;
          passing_score?:        number;
          critical_question_ids?: string[];
          duration_hours?:       number | null;
          is_active?:            boolean;
        };
        Relationships: [];
      };
      operator_progress: {
        Row: {
          id:           string;
          operator_id:  string;
          module_id:    string;
          status:       string;
          is_competent: boolean;
          score:        number | null;
          attempts:     number;
          scorm_data:   Json | null;
          completed_at: string | null;
          reset_at:     string | null;
          created_at:   string;
          updated_at:   string;
        };
        Insert: {
          id?:          string;
          operator_id:  string;
          module_id:    string;
          status?:      string;
          is_competent?: boolean;
          score?:       number | null;
          attempts?:    number;
          scorm_data?:  Json | null;
          completed_at?: string | null;
          reset_at?:    string | null;
          updated_at?:  string;
        };
        Update: {
          status?:      string;
          is_competent?: boolean;
          score?:       number | null;
          attempts?:    number;
          scorm_data?:  Json | null;
          completed_at?: string | null;
          reset_at?:    string | null;
          updated_at?:  string;
        };
        Relationships: [];
      };
      spartan_audit_log: {
        Row: {
          id:          number;
          operator_id: string | null;
          event:       string;
          module_id:   string | null;
          trigger_id:  string | null;
          score:       number | null;
          metadata:    Json | null;
          ip_address:  string | null;
          user_agent:  string | null;
          created_at:  string;
        };
        Insert: {
          operator_id?: string | null;
          event:        string;
          module_id?:   string | null;
          trigger_id?:  string | null;
          score?:       number | null;
          metadata?:    Json | null;
          ip_address?:  string | null;
          user_agent?:  string | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id:          string;
          module_id:   string;
          sequence:    number;
          question:    string;
          option_a:    string;
          option_b:    string;
          option_c:    string;
          option_d:    string;
          correct:     string;
          explanation: string | null;
          is_critical: boolean;
          topic:       string | null;
          created_at:  string;
        };
        Insert: {
          id?:         string;
          module_id:   string;
          sequence:    number;
          question:    string;
          option_a:    string;
          option_b:    string;
          option_c:    string;
          option_d:    string;
          correct:     string;
          explanation?: string | null;
          is_critical?: boolean;
          topic?:      string | null;
        };
        Update: {
          question?:   string;
          option_a?:   string;
          option_b?:   string;
          option_c?:   string;
          option_d?:   string;
          correct?:    string;
          explanation?: string | null;
          is_critical?: boolean;
          topic?:      string | null;
        };
        Relationships: [];
      };
      quiz_sessions: {
        Row: {
          id:            string;
          operator_id:   string;
          module_id:     string;
          started_at:    string;
          submitted_at:  string | null;
          score:         number | null;
          passed:        boolean | null;
          critical_fail: boolean;
          answers:       Json | null;
        };
        Insert: {
          id?:           string;
          operator_id:   string;
          module_id:     string;
          started_at?:   string;
          submitted_at?: string | null;
          score?:        number | null;
          passed?:       boolean | null;
          critical_fail?: boolean;
          answers?:      Json | null;
        };
        Update: {
          submitted_at?: string | null;
          score?:        number | null;
          passed?:       boolean | null;
          critical_fail?: boolean;
          answers?:      Json | null;
        };
        Relationships: [];
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
};
