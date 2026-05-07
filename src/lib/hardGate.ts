import { supabaseAdmin } from './supabaseServer';

export type HardGateResult = 'PASS' | 'FAIL' | 'CRITICAL_FAIL';

export interface ScormPayload {
  lessonStatus?: string;
  scoreRaw?: string;
  interactions?: Record<string, string>; // cmi.interactions.{id}.result
  sessionTime?: string;
}

// Primary entry point called by the SCORM Cloud webhook handler.
// All database writes use the service role — no client can influence this path.
export async function evaluateCompletion(
  operatorId: string,
  moduleId: string,
  scormData: ScormPayload,
): Promise<HardGateResult> {
  const { data: module, error } = await supabaseAdmin
    .from('mjm_modules')
    .select('passing_score, critical_question_ids')
    .eq('id', moduleId)
    .single();

  if (error || !module) throw new Error(`Module ${moduleId} not found in mjm_modules`);

  const score = parseFloat(scormData.scoreRaw ?? '0');
  const criticalIds: string[] = module.critical_question_ids ?? [];

  // ── 1. Critical Fail check ────────────────────────────────
  let criticalFailTriggerId: string | null = null;
  for (const qId of criticalIds) {
    const result = scormData.interactions?.[`${qId}.result`];
    if (result && result !== 'correct') {
      criticalFailTriggerId = qId;
      break;
    }
  }

  if (criticalFailTriggerId) {
    await supabaseAdmin.from('operator_progress').upsert(
      {
        operator_id:  operatorId,
        module_id:    moduleId,
        status:       'reset',
        is_competent: false,
        score,
        scorm_data:   scormData,
        reset_at:     new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      },
      { onConflict: 'operator_id,module_id' },
    );

    // Fire commander notification without blocking the webhook response
    void notifyCommander(operatorId, moduleId, score, criticalFailTriggerId);

    return 'CRITICAL_FAIL';
  }

  // ── 2. Score evaluation ───────────────────────────────────
  const isCompetent = score >= (module.passing_score ?? 80);

  await supabaseAdmin.from('operator_progress').upsert(
    {
      operator_id:  operatorId,
      module_id:    moduleId,
      status:       isCompetent ? 'completed' : 'failed',
      is_competent: isCompetent,
      score,
      scorm_data:   scormData,
      completed_at: isCompetent ? new Date().toISOString() : null,
      updated_at:   new Date().toISOString(),
    },
    { onConflict: 'operator_id,module_id' },
  );

  return isCompetent ? 'PASS' : 'FAIL';
}

async function notifyCommander(
  operatorId: string,
  moduleId: string,
  score: number,
  triggerQuestionId: string,
): Promise<void> {
  const { data: operator } = await supabaseAdmin
    .from('operators')
    .select('full_name, operator_id, commander_email')
    .eq('id', operatorId)
    .single();

  if (!operator?.commander_email) return;

  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notify-commander`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to:               operator.commander_email,
        operatorName:     operator.full_name,
        operatorId:       operator.operator_id,
        moduleId,
        score,
        triggerQuestionId,
        timestamp:        new Date().toISOString(),
      }),
    },
  ).catch(() => {
    // Notification failure must not fail the webhook response
  });
}
