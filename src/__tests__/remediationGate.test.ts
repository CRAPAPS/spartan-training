import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
vi.mock('@/lib/supabaseServer', () => ({
  supabaseAdmin: { from: (...a: unknown[]) => mockFrom(...a) },
}));

import { getOutstandingRemediation } from '@/lib/remediationServer';

// Minimal PostgREST-shaped chain stub. Every builder method returns the chain;
// maybeSingle/single resolve, and `then` makes the chain itself awaitable for the
// queries that do not terminate in single().
function stubTables(tables: Record<string, { data: unknown }>) {
  mockFrom.mockImplementation((table: string) => {
    const result = tables[table] ?? { data: null };
    const chain: Record<string, unknown> = {};
    for (const m of ['select', 'eq', 'in', 'order', 'limit']) {
      chain[m] = () => chain;
    }
    chain.maybeSingle = () => Promise.resolve(result);
    chain.single = () => Promise.resolve(result);
    chain.then = (res: (v: unknown) => unknown) => Promise.resolve(result).then(res);
    return chain;
  });
}

beforeEach(() => mockFrom.mockReset());

describe('getOutstandingRemediation', () => {
  it('returns null when there is no critical-fail session', async () => {
    stubTables({ quiz_sessions: { data: null } });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('returns the outstanding items when a critical fail has no records', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: 'MOD-02-s01' }] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'Justification & Deadly Force' } },
    });
    const out = await getOutstandingRemediation('op-1', 'MOD-02');
    expect(out?.sessionId).toBe('sess-1');
    expect(out?.outstandingCount).toBe(1);
    expect(out?.items[0].questionId).toBe('q1');
    expect(out?.moduleTitle).toBe('Justification & Deadly Force');
  });

  it('returns null once every missed item has a record — the gate opens', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: null }] },
      remediation_records: { data: [{ question_id: 'q1' }] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('returns null when the module has no critical questions at all', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('returns null when the critical questions were all answered correctly', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'B' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: null }] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('falls back to the module id when the title cannot be read', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: null }] },
      remediation_records: { data: [] },
      mjm_modules: { data: null },
    });
    expect((await getOutstandingRemediation('op-1', 'MOD-02'))?.moduleTitle).toBe('MOD-02');
  });

  it('tolerates a session whose answers column is null — every critical item is missed', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: null } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: null }] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect((await getOutstandingRemediation('op-1', 'MOD-02'))?.outstandingCount).toBe(1);
  });
});
