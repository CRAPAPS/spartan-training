// Corrective Action Gate — the database-backed resolver.
//
// SERVER ONLY. Split out of ./remediation because CorrectiveActionScreen is a client
// component and imports the pure helpers from there; keeping supabaseServer in the
// same module pulled the service-role client into the browser bundle and failed
// `next build`. Pure logic and types stay in ./remediation, which is client-safe.
//
// This is the SINGLE SOURCE OF TRUTH for whether a learner owes corrective action.
// Both the quiz page gate and the quiz API route call it — this codebase already has
// independent page and route implementations of the enrollment and sequential gates,
// and that is exactly how they drift apart.

import { supabaseAdmin } from './supabaseServer';
import {
  computeMissedItems,
  type CriticalQuestionRow,
  type OutstandingRemediation,
} from './remediation';

/**
 * Whether this operator owes corrective action on this module.
 *
 * Returns null when they are clear to attempt.
 *
 * Resolved entirely SERVER-SIDE. The learner must be able to submit a quiz, close
 * the tab, and come back tomorrow — at which point they no longer hold the session
 * id from the results screen. Any design that depends on the client carrying it
 * forward strands the first learner who closes the tab.
 *
 * "Most recent session" is unambiguous: while the gate is closed the learner cannot
 * start another session, so no newer quiz_sessions row can exist until remediation
 * completes. The latest row is always the one that closed the gate.
 */
export async function getOutstandingRemediation(
  operatorId: string,
  moduleId: string,
): Promise<OutstandingRemediation | null> {
  const { data: session } = await supabaseAdmin
    .from('quiz_sessions')
    .select('id, answers')
    .eq('operator_id', operatorId)
    .eq('module_id', moduleId)
    .eq('critical_fail', true)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) return null;

  const s = session as unknown as { id: string; answers: Record<string, string | null> | null };

  const { data: criticals } = await supabaseAdmin
    .from('quiz_questions')
    .select('id, question, correct, explanation, remediation_slide_id')
    .eq('module_id', moduleId)
    .eq('is_critical', true);

  const criticalRows = (criticals ?? []) as unknown as CriticalQuestionRow[];
  if (criticalRows.length === 0) return null;

  const { data: records } = await supabaseAdmin
    .from('remediation_records')
    .select('question_id')
    .eq('quiz_session_id', s.id);

  const done = ((records ?? []) as unknown as Array<{ question_id: string }>).map((r) => r.question_id);
  const items = computeMissedItems(s.answers ?? {}, criticalRows, done);
  const outstandingCount = items.filter((i) => !i.remediated).length;

  if (outstandingCount === 0) return null;

  const { data: module } = await supabaseAdmin
    .from('mjm_modules')
    .select('title')
    .eq('id', moduleId)
    .single();

  return {
    sessionId: s.id,
    moduleId,
    moduleTitle: (module as unknown as { title?: string } | null)?.title ?? moduleId,
    items,
    outstandingCount,
  };
}
