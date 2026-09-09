import { describe, it, expect } from 'vitest';
// Build-time helper, deliberately outside src/ — it parses review artefacts and
// emits migration SQL, so it must not ship in the application bundle.
import { parseAnswers, mergeAnchors, toSqlLines } from '../../scripts/lib/anchors.mjs';

describe('parseAnswers', () => {
  it('reads question id and slide id from an ANSWER line', () => {
    const m = parseAnswers('ANSWER for mod01-q3:  MOD-01-s00');
    expect(m.get('mod01-q3')).toBe('MOD-01-s00');
  });

  it('ignores comments, blank lines and prose', () => {
    const m = parseAnswers(`
# REVISION HISTORY
#   rev 7 — two moved
      ANSWER for uas07-q3:  UAS-07-s05

not an answer line at all
`);
    expect([...m.keys()]).toEqual(['uas07-q3']);
  });

  it('maps NONE to null, case-insensitively', () => {
    const m = parseAnswers('ANSWER for pi24-q7: NONE\nANSWER for pi24-q9: none');
    expect(m.get('pi24-q7')).toBeNull();
    expect(m.get('pi24-q9')).toBeNull();
  });

  it('keeps cross-module ids intact', () => {
    const m = parseAnswers('ANSWER for uas24-q3: UAS-07-s01');
    expect(m.get('uas24-q3')).toBe('UAS-07-s01');
  });
});

describe('mergeAnchors', () => {
  const proposals = [
    { question_id: 'q-high', proposed_slide_id: 'MOD-01-s00', confidence: 'HIGH' },
    { question_id: 'q-med', proposed_slide_id: 'MOD-01-s02', confidence: 'MEDIUM' },
    { question_id: 'q-low', proposed_slide_id: 'MOD-01-s03', confidence: 'LOW' },
  ];

  it('accepts a HIGH proposal when nothing overrides it', () => {
    expect(mergeAnchors(proposals, new Map()).get('q-high')).toBe('MOD-01-s00');
  });

  it('drops MEDIUM and LOW proposals — unreviewed guesses must not ship', () => {
    const merged = mergeAnchors(proposals, new Map());
    expect(merged.has('q-med')).toBe(false);
    expect(merged.has('q-low')).toBe(false);
  });

  it('lets a reviewed answer override a HIGH proposal', () => {
    const merged = mergeAnchors(proposals, new Map([['q-high', 'MOD-01-s09']]));
    expect(merged.get('q-high')).toBe('MOD-01-s09');
  });

  it('lets a reviewed answer supply an anchor for a MEDIUM row', () => {
    const merged = mergeAnchors(proposals, new Map([['q-med', 'MOD-01-s05']]));
    expect(merged.get('q-med')).toBe('MOD-01-s05');
  });

  it('honours an explicit NONE over a HIGH proposal', () => {
    const merged = mergeAnchors(proposals, new Map([['q-high', null]]));
    expect(merged.get('q-high')).toBeNull();
  });
});

describe('toSqlLines', () => {
  it('emits one UPDATE per anchored question, ordered by question id', () => {
    const sql = toSqlLines(new Map([['q-b', 'MOD-01-s01'], ['q-a', 'MOD-02-s02']]));
    expect(sql).toEqual([
      "UPDATE quiz_questions SET remediation_slide_id = 'MOD-02-s02' WHERE id = 'q-a';",
      "UPDATE quiz_questions SET remediation_slide_id = 'MOD-01-s01' WHERE id = 'q-b';",
    ]);
  });

  it('skips NONE entries — they ship unanchored and degrade to module overview', () => {
    expect(toSqlLines(new Map([['q-a', null]]))).toEqual([]);
  });

  it('escapes single quotes so an id can never break out of the literal', () => {
    const sql = toSqlLines(new Map([["q'x", 'MOD-01-s01']]));
    expect(sql[0]).toContain("WHERE id = 'q''x';");
  });
});
