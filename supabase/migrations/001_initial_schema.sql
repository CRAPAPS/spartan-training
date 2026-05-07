-- =============================================================================
-- SPARTAN LMS — Initial Schema
-- MJM 2026 Armed Security Accreditation (GBPDSA 16hr)
-- Migration: 001_initial_schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLE: operators
-- Extends Supabase auth.users. One row per enrolled operator.
-- ---------------------------------------------------------------------------
CREATE TABLE public.operators (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_id      TEXT        UNIQUE NOT NULL,
  full_name        TEXT        NOT NULL,
  email            TEXT        UNIQUE NOT NULL,
  license_number   TEXT,
  state            TEXT,
  track            TEXT        NOT NULL DEFAULT 'armed-security',
  mfa_enabled      BOOLEAN     DEFAULT false,
  enrolled_at      TIMESTAMPTZ DEFAULT NOW(),
  commander_email  TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.operators.operator_id     IS 'Format: ST-YY-NNNN (e.g. ST-26-0001)';
COMMENT ON COLUMN public.operators.commander_email IS 'Notification recipient for Critical Fail events';

-- ---------------------------------------------------------------------------
-- TABLE: mjm_modules
-- 16 modules for the MJM 2026 Armed Security program.
-- ---------------------------------------------------------------------------
CREATE TABLE public.mjm_modules (
  id                    TEXT    PRIMARY KEY,
  title                 TEXT    NOT NULL,
  description           TEXT,
  sequence_order        INT     NOT NULL UNIQUE,
  track                 TEXT    NOT NULL DEFAULT 'armed-security',
  scorm_course_id       TEXT    NOT NULL DEFAULT 'TBD',
  passing_score         INT     DEFAULT 80 CHECK (passing_score BETWEEN 0 AND 100),
  critical_question_ids TEXT[]  DEFAULT '{}',
  duration_hours        NUMERIC(4,1),
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN public.mjm_modules.scorm_course_id       IS 'Populated after uploading .zip to SCORM Cloud';
COMMENT ON COLUMN public.mjm_modules.critical_question_ids IS 'SCORM interaction IDs — wrong answer triggers Tactical Reset';

-- ---------------------------------------------------------------------------
-- TABLE: operator_progress
-- Authoritative gradebook. One row per (operator, module).
-- ALL writes are server-side only (service role). Operators have SELECT only.
-- ---------------------------------------------------------------------------
CREATE TABLE public.operator_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id  UUID        NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  module_id    TEXT        NOT NULL REFERENCES public.mjm_modules(id),
  status       TEXT        NOT NULL DEFAULT 'not_started'
                           CHECK (status IN ('not_started','in_progress','completed','failed','reset')),
  is_competent BOOLEAN     DEFAULT false,
  score        NUMERIC(5,2),
  attempts     INT         DEFAULT 0,
  scorm_data   JSONB,
  completed_at TIMESTAMPTZ,
  reset_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(operator_id, module_id)
);

COMMENT ON COLUMN public.operator_progress.is_competent IS 'TRUE only when status=completed AND score >= module passing_score';
COMMENT ON COLUMN public.operator_progress.scorm_data   IS 'Full cmi.* payload from SCORM Cloud webhook';

-- ---------------------------------------------------------------------------
-- TABLE: spartan_audit_log
-- Forensic record. APPEND ONLY. No UPDATE or DELETE — ever.
-- Written exclusively by the fn_audit_progress_change trigger (SECURITY DEFINER).
-- ---------------------------------------------------------------------------
CREATE TABLE public.spartan_audit_log (
  id           BIGSERIAL   PRIMARY KEY,
  operator_id  UUID        REFERENCES public.operators(id),
  event        TEXT        NOT NULL,
  module_id    TEXT        REFERENCES public.mjm_modules(id),
  trigger_id   TEXT,
  score        NUMERIC(5,2),
  metadata     JSONB,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.spartan_audit_log IS
  'Immutable forensic log. Event types: LOGIN | LOGOUT | MODULE_START | '
  'SCORM_COMPLETE | SCORE_RECORDED | CRITICAL_FAIL | TACTICAL_RESET | '
  'MODULE_UNLOCK | MFA_ENABLED | AUTH_FAILED';

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.operators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mjm_modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spartan_audit_log   ENABLE ROW LEVEL SECURITY;

-- operators: own row only
CREATE POLICY "operators_select_own" ON public.operators
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "operators_update_own" ON public.operators
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- mjm_modules: THE HARD GATE
-- An operator can only SELECT a module if:
--   a) It is the first module (sequence_order = 1), OR
--   b) The preceding module has is_competent = true for this operator.
-- A blocked module returns no row — the client cannot even discover it exists.
CREATE POLICY "hard_gate_module_access" ON public.mjm_modules
  FOR SELECT USING (
    is_active = true
    AND (
      sequence_order = 1
      OR EXISTS (
        SELECT 1
        FROM   public.operator_progress op
        JOIN   public.mjm_modules prev
               ON  prev.id = op.module_id
               AND prev.sequence_order = mjm_modules.sequence_order - 1
        WHERE  op.operator_id = auth.uid()
          AND  op.is_competent = true
      )
    )
  );

-- operator_progress: operators SELECT their own rows; no client-side writes
CREATE POLICY "progress_select_own" ON public.operator_progress
  FOR SELECT USING (auth.uid() = operator_id);

-- spartan_audit_log: no client SELECT or write access whatsoever
-- INSERT is handled by the SECURITY DEFINER trigger below.

-- =============================================================================
-- FORENSIC INTEGRITY: IMMUTABLE AUDIT TRIGGER
-- SECURITY DEFINER ensures the function runs as the table owner,
-- bypassing any RLS restriction — guaranteeing every state change
-- produces an audit entry even if the calling role has no INSERT permission.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.fn_audit_progress_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.spartan_audit_log (operator_id, event, module_id, metadata)
    VALUES (NEW.operator_id, 'MODULE_START', NEW.module_id,
            jsonb_build_object('status', NEW.status));

  ELSIF TG_OP = 'UPDATE' THEN

    -- Competent completion
    IF NEW.is_competent = true AND (OLD.is_competent IS DISTINCT FROM true) THEN
      INSERT INTO public.spartan_audit_log (operator_id, event, module_id, score, metadata)
      VALUES (NEW.operator_id, 'SCORM_COMPLETE', NEW.module_id, NEW.score,
              jsonb_build_object('attempts', NEW.attempts));

    -- Score recorded but not competent
    ELSIF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.is_competent = false THEN
      INSERT INTO public.spartan_audit_log (operator_id, event, module_id, score, metadata)
      VALUES (NEW.operator_id, 'SCORE_RECORDED', NEW.module_id, NEW.score,
              jsonb_build_object('attempts', NEW.attempts, 'passing_required',
                (SELECT passing_score FROM public.mjm_modules WHERE id = NEW.module_id)));

    -- Tactical Reset
    ELSIF NEW.status = 'reset' AND OLD.status != 'reset' THEN
      INSERT INTO public.spartan_audit_log (operator_id, event, module_id, score, metadata)
      VALUES (NEW.operator_id, 'TACTICAL_RESET', NEW.module_id, OLD.score,
              jsonb_build_object('previous_status', OLD.status,
                                 'previous_score', OLD.score,
                                 'reset_at', NOW()));

    -- Critical Fail
    ELSIF NEW.status = 'failed' AND OLD.status != 'failed' THEN
      INSERT INTO public.spartan_audit_log (operator_id, event, module_id, score, metadata)
      VALUES (NEW.operator_id, 'CRITICAL_FAIL', NEW.module_id, NEW.score,
              jsonb_build_object('attempts', NEW.attempts));
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_progress
  AFTER INSERT OR UPDATE ON public.operator_progress
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit_progress_change();

-- =============================================================================
-- SEED DATA: 16 MJM 2026 MODULES
-- scorm_course_id values updated after uploading packages to SCORM Cloud
-- =============================================================================

INSERT INTO public.mjm_modules
  (id, title, sequence_order, track, scorm_course_id, passing_score, duration_hours)
VALUES
  ('MOD-01', 'Legal Foundations & Use of Force',    1,  'armed-security', 'TBD', 80, 2.0),
  ('MOD-02', 'Firearms Safety & Handling',           2,  'armed-security', 'TBD', 80, 1.5),
  ('MOD-03', 'Threat Assessment & De-escalation',    3,  'armed-security', 'TBD', 80, 1.5),
  ('MOD-04', 'Post Orders & Site Security',          4,  'armed-security', 'TBD', 75, 1.0),
  ('MOD-05', 'Emergency Response Procedures',        5,  'armed-security', 'TBD', 80, 1.5),
  ('MOD-06', 'Patrol Techniques & Surveillance',     6,  'armed-security', 'TBD', 75, 1.0),
  ('MOD-07', 'Report Writing & Documentation',       7,  'armed-security', 'TBD', 75, 1.0),
  ('MOD-08', 'Access Control & Crowd Management',    8,  'armed-security', 'TBD', 75, 1.0),
  ('MOD-09', 'First Aid & Crisis Response',          9,  'armed-security', 'TBD', 80, 1.0),
  ('MOD-10', 'Georgia Law: GBPDSA Compliance',       10, 'armed-security', 'TBD', 85, 1.0),
  ('MOD-11', 'Workplace Violence Prevention',        11, 'armed-security', 'TBD', 75, 1.0),
  ('MOD-12', 'Cyber Awareness for Field Operators',  12, 'armed-security', 'TBD', 75, 0.5),
  ('MOD-13', 'Evidence Handling & Chain of Custody', 13, 'armed-security', 'TBD', 80, 0.5),
  ('MOD-14', 'Executive Protection Fundamentals',    14, 'armed-security', 'TBD', 75, 0.5),
  ('MOD-15', 'Scenario Practicum: Field Judgment',   15, 'armed-security', 'TBD', 80, 0.5),
  ('MOD-16', 'Final Accreditation Examination',      16, 'armed-security', 'TBD', 85, 1.0);
