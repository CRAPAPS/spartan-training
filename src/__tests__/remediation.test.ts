import { describe, it, expect } from 'vitest';
import {
  computeMissedItems,
  validateNotes,
  resolveSlideIndex,
  moduleIdFromSlideId,
  NOTE_MIN_CHARS,
  type CriticalQuestionRow,
} from '@/lib/remediation';

const QUESTIONS: CriticalQuestionRow[] = [
  { id: 'q1', question: 'Deadly force?', correct: 'B', explanation: 'OCGA 16-3-21', remediation_slide_id: 'MOD-02-s01' },
  { id: 'q2', question: 'Trigger discipline?', correct: 'C', explanation: null, remediation_slide_id: null },
];

describe('computeMissedItems', () => {
  it('returns only critical questions answered incorrectly', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('treats an unanswered critical question as missed', () => {
    const items = computeMissedItems({ q1: null, q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('treats a question absent from the answers object as missed', () => {
    const items = computeMissedItems({ q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('returns an empty array when every critical question is correct', () => {
    expect(computeMissedItems({ q1: 'B', q2: 'C' }, QUESTIONS, [])).toEqual([]);
  });

  it('marks items that already have a remediation record', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'D' }, QUESTIONS, ['q1']);
    expect(items.find(i => i.questionId === 'q1')?.remediated).toBe(true);
    expect(items.find(i => i.questionId === 'q2')?.remediated).toBe(false);
  });

  it('carries the slide anchor through, null included', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'D' }, QUESTIONS, []);
    expect(items.find(i => i.questionId === 'q1')?.slideId).toBe('MOD-02-s01');
    expect(items.find(i => i.questionId === 'q2')?.slideId).toBeNull();
  });

  it('records the answer the learner actually gave', () => {
    const items = computeMissedItems({ q1: 'A' }, QUESTIONS, []);
    expect(items.find(i => i.questionId === 'q1')?.givenAnswer).toBe('A');
    expect(items.find(i => i.questionId === 'q1')?.correctAnswer).toBe('B');
  });
});

describe('validateNotes', () => {
  const long = 'x'.repeat(NOTE_MIN_CHARS);

  it('accepts three sufficiently long notes', () => {
    expect(validateNotes({ noteError: long, noteStandard: long, noteFieldAction: long })).toBeNull();
  });

  it('names the field that is too short', () => {
    expect(validateNotes({ noteError: 'too short', noteStandard: long, noteFieldAction: long }))
      .toContain('noteError');
  });

  it('rejects whitespace padding', () => {
    expect(validateNotes({ noteError: ' '.repeat(200), noteStandard: long, noteFieldAction: long }))
      .toContain('noteError');
  });

  it('checks every field, not just the first', () => {
    expect(validateNotes({ noteError: long, noteStandard: long, noteFieldAction: 'nope' }))
      .toContain('noteFieldAction');
  });
});

describe('resolveSlideIndex', () => {
  const slides = [
    { slideId: 'MOD-02-s00', heading: 'A' },
    { slideId: 'MOD-02-s01', heading: 'B' },
  ];

  it('finds the index of a matching slide id', () => {
    expect(resolveSlideIndex(slides, 'MOD-02-s01')).toBe(1);
  });

  it('returns null for a null anchor', () => {
    expect(resolveSlideIndex(slides, null)).toBeNull();
  });

  it('returns null when the anchor no longer resolves — degrades, never traps', () => {
    expect(resolveSlideIndex(slides, 'MOD-02-s99')).toBeNull();
  });

  it('tolerates slides with no slideId at all', () => {
    expect(resolveSlideIndex([{ heading: 'no id' }], 'MOD-02-s00')).toBeNull();
  });
});

describe('moduleIdFromSlideId', () => {
  it('derives the module from a slide id', () => {
    expect(moduleIdFromSlideId('PI-06-s02')).toBe('PI-06');
    expect(moduleIdFromSlideId('MOD-02-s01')).toBe('MOD-02');
    expect(moduleIdFromSlideId('UAS-24-s00')).toBe('UAS-24');
  });

  it('handles double-digit slide numbers', () => {
    expect(moduleIdFromSlideId('PI-14-s12')).toBe('PI-14');
  });

  it('returns null for null or a malformed id', () => {
    expect(moduleIdFromSlideId(null)).toBeNull();
    expect(moduleIdFromSlideId('not-a-slide-id')).toBeNull();
    expect(moduleIdFromSlideId('PI-06')).toBeNull();
  });
});
