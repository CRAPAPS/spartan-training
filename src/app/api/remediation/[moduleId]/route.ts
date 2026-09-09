export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { getOutstandingRemediation, validateNotes } from '@/lib/remediation';

/**
 * Corrective action gate — the endpoint that replaces the 24-hour lockout.
 *
 * GET  returns what this operator still owes on this module, or null if clear.
 * POST records one corrective action; the retry reopens once none are outstanding.
 *
 * Follows src/app/api/practical/[moduleId]/route.ts: session client for auth only,
 * service role for every data operation.
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(await getOutstandingRemediation(user.id, moduleId));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    sessionId, questionId, slideViewedAt,
    noteError = '', noteStandard = '', noteFieldAction = '',
  } = body as Record<string, unknown>;

  if (typeof sessionId !== 'string' || typeof questionId !== 'string') {
    return NextResponse.json({ error: 'sessionId and questionId are required' }, { status: 400 });
  }

  const notes = {
    noteError: String(noteError ?? ''),
    noteStandard: String(noteStandard ?? ''),
    noteFieldAction: String(noteFieldAction ?? ''),
  };

  const invalid = validateNotes(notes);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  // A record may only be written for a question this operator genuinely missed in
  // THIS session. Without this check the endpoint is a way to fabricate an
  // evidentiary record on a GA 509 licensing platform. Resolved server-side, so a
  // forged sessionId or questionId in the body cannot get past it.
  const outstanding = await getOutstandingRemediation(user.id, moduleId);
  if (!outstanding || outstanding.sessionId !== sessionId) {
    return NextResponse.json(
      { error: 'No outstanding corrective action for this session' },
      { status: 403 },
    );
  }

  const item = outstanding.items.find((i) => i.questionId === questionId);
  if (!item) {
    return NextResponse.json(
      { error: 'That question was not missed in this session' },
      { status: 403 },
    );
  }

  // question_text / explanation_text are denormalized so the record stays legible
  // if the question is later reworded or re-seeded.
  const { error } = await supabaseAdmin
    .from('remediation_records')
    .upsert({
      operator_id:       user.id,
      module_id:         moduleId,
      quiz_session_id:   sessionId,
      question_id:       questionId,
      question_text:     item.question,
      explanation_text:  item.explanation,
      given_answer:      item.givenAnswer,
      correct_answer:    item.correctAnswer,
      slide_id:          item.slideId,
      slide_viewed_at:   typeof slideViewedAt === 'string' ? slideViewedAt : null,
      note_error:        notes.noteError.trim(),
      note_standard:     notes.noteStandard.trim(),
      note_field_action: notes.noteFieldAction.trim(),
    }, { onConflict: 'quiz_session_id,question_id' });

  if (error) {
    console.error('[remediation] write failed:', error.message);
    return NextResponse.json({ error: 'Could not record corrective action' }, { status: 500 });
  }

  const after = await getOutstandingRemediation(user.id, moduleId);
  return NextResponse.json({
    outstandingCount: after?.outstandingCount ?? 0,
    cleared: after === null,
  });
}
