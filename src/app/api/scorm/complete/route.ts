import { NextRequest, NextResponse } from 'next/server';
import { scormCloud } from '@/lib/scormCloud';
import { evaluateCompletion, type ScormPayload } from '@/lib/hardGate';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();

  // ── 1. Verify SCORM Cloud webhook signature ──────────────
  const signature = req.headers.get('x-rustici-signature') ?? '';
  if (!scormCloud.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── 2. Extract registration metadata ─────────────────────
  // registrationId format set during createRegistration: {operatorId}__{moduleId}
  const registrationId = (payload?.registration as Record<string, unknown>)?.id as string ?? '';
  const parts = registrationId.split('__');
  if (parts.length !== 2) {
    return NextResponse.json({ error: 'Invalid registrationId format' }, { status: 400 });
  }
  const [operatorId, moduleId] = parts;

  // ── 3. Extract SCORM runtime data ────────────────────────
  const runtimeData = (payload?.registration as Record<string, unknown>)?.registrationCompletion as Record<string, unknown> ?? {};
  const scormPayload: ScormPayload = {
    lessonStatus: runtimeData['completionStatus'] as string,
    scoreRaw:     (runtimeData['score'] as Record<string, unknown>)?.raw as string,
    interactions: runtimeData['interactions'] as Record<string, string>,
    sessionTime:  runtimeData['totalSecondsTracked'] as string,
  };

  // ── 4. Hard Gate evaluation ───────────────────────────────
  try {
    const hardGateResult = await evaluateCompletion(operatorId, moduleId, scormPayload);
    return NextResponse.json({ hardGateResult }, { status: 200 });
  } catch (err) {
    console.error('[SCORM webhook] evaluateCompletion failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
