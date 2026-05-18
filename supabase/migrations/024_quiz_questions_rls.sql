-- Migration 024: Gate quiz_questions SELECT to earned modules only
-- Previously quiz_questions used FOR SELECT USING (true) which allowed any
-- authenticated user to read all answers regardless of module progress.
-- This replaces it with the same hard-gate pattern used by module_lessons.

DROP POLICY IF EXISTS "quiz_questions_select" ON public.quiz_questions;

CREATE POLICY "quiz_questions_gate" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mjm_modules m
      WHERE m.id = quiz_questions.module_id
        AND (
          m.sequence_order = 1
          OR EXISTS (
            SELECT 1 FROM public.operator_progress op
            JOIN public.mjm_modules prev
              ON prev.id = op.module_id
              AND prev.sequence_order = m.sequence_order - 1
            WHERE op.operator_id = auth.uid()
              AND op.is_competent = true
          )
        )
    )
  );
